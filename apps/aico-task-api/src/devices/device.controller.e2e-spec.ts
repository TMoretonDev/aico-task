import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import type {
  CreateDeviceInterface,
  DeviceResponseInterface,
  DeviceTypeResponseInterface,
} from '@aico-task/shared-types';
import { AppModule } from '../app.module';

describe('Devices API (e2e)', () => {
  const RUN_ID = Date.now();

  let app: INestApplication;
  let deviceType: DeviceTypeResponseInterface;
  const createdIds: number[] = [];

  const buildPayload = (
    overrides: Partial<CreateDeviceInterface> = {},
  ): CreateDeviceInterface => ({
    name: `E2E Device ${RUN_ID}`,
    manufacturer: `E2E Manufacturer ${RUN_ID}`,
    serialNumber: randomUUID(),
    typeId: deviceType.id,
    online: false,
    latitude: 51.5074,
    longitude: -0.1278,
    ...overrides,
  });

  async function createDisposableDevice(
    overrides: Partial<CreateDeviceInterface> = {},
  ): Promise<DeviceResponseInterface> {
    const res = await request(app.getHttpServer())
      .post('/devices')
      .send(buildPayload(overrides));
    expect(res.status).toBe(201);
    createdIds.push(res.body.id);
    return res.body;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    const res = await request(app.getHttpServer()).get('/device-types');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    deviceType = res.body[0];
  });

  afterAll(async () => {
    await Promise.all(
      createdIds.map((id) =>
        request(app.getHttpServer()).delete(`/devices/${id}`),
      ),
    );
    await app.close();
  });

  describe('POST /devices', () => {
    describe('success', () => {
      it('creates a device and returns 201 with the created row', async () => {
        const payload = buildPayload();
        const res = await request(app.getHttpServer())
          .post('/devices')
          .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          id: expect.any(Number),
          name: payload.name,
          manufacturer: payload.manufacturer,
          serialNumber: payload.serialNumber,
          typeId: payload.typeId,
          online: payload.online,
          latitude: payload.latitude,
          longitude: payload.longitude,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        createdIds.push(res.body.id);

        const readRes = await request(app.getHttpServer()).get(
          `/devices/${res.body.id}`,
        );
        expect(readRes.status).toBe(200);
        expect(readRes.body).toMatchObject({
          name: payload.name,
          serialNumber: payload.serialNumber,
        });
      });
    });

    describe('parameter validation', () => {
      it('returns 400 when serial number is not a valid UUID', async () => {
        const res = await request(app.getHttpServer())
          .post('/devices')
          .send(buildPayload({ serialNumber: 'not-a-uuid' }));

        expect(res.status).toBe(400);
      });

      it('returns 400 when name is empty', async () => {
        const res = await request(app.getHttpServer())
          .post('/devices')
          .send(buildPayload({ name: '' }));

        expect(res.status).toBe(400);
      });

      it('returns 400 when serial number is already in use', async () => {
        const first = await createDisposableDevice();
        const res = await request(app.getHttpServer())
          .post('/devices')
          .send(buildPayload({ serialNumber: first.serialNumber }));

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);

        const listRes = await request(app.getHttpServer()).get('/devices');
        expect(listRes.status).toBe(200);
        const matches = (listRes.body as DeviceResponseInterface[]).filter(
          (d) => d.serialNumber === first.serialNumber,
        );
        expect(matches).toHaveLength(1);
      });
    });
  });

  describe('GET /devices', () => {
    describe('success', () => {
      it('returns 200 with an array that includes devices created in this run', async () => {
        const createdDevice = await createDisposableDevice();
        const res = await request(app.getHttpServer()).get('/devices');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const found = (res.body as DeviceResponseInterface[]).find(
          (device) => device.id === createdDevice.id,
        );
        expect(found).toMatchObject({
          id: createdDevice.id,
          name: createdDevice.name,
          serialNumber: createdDevice.serialNumber,
          typeId: createdDevice.typeId,
        });
      });
    });
  });

  describe('GET /devices/:id', () => {
    describe('success', () => {
      it('returns 200 with the matching device', async () => {
        const createdDevice = await createDisposableDevice();
        const res = await request(app.getHttpServer()).get(
          `/devices/${createdDevice.id}`,
        );

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          id: createdDevice.id,
          name: createdDevice.name,
          serialNumber: createdDevice.serialNumber,
        });
      });
    });

    describe('parameter validation', () => {
      it('returns 400 when id is not numeric', async () => {
        const res = await request(app.getHttpServer()).get(
          '/devices/not-a-number',
        );
        expect(res.status).toBe(400);
      });

      it('returns 404 when no device matches the id', async () => {
        const res = await request(app.getHttpServer()).get(
          '/devices/999999999',
        );
        expect(res.status).toBe(404);
      });
    });
  });

  describe('PATCH /devices/:id', () => {
    describe('success', () => {
      it('updates the device and returns 200 with the updated row', async () => {
        const createdDevice = await createDisposableDevice();
        const newName = `Updated ${RUN_ID}-${createdDevice.id}`;

        const res = await request(app.getHttpServer())
          .patch(`/devices/${createdDevice.id}`)
          .send({ name: newName });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          id: createdDevice.id,
          name: newName,
        });

        const readRes = await request(app.getHttpServer()).get(
          `/devices/${createdDevice.id}`,
        );
        expect(readRes.status).toBe(200);
        expect(readRes.body.name).toBe(newName);
      });
    });

    describe('parameter validation', () => {
      it('returns 404 when the device does not exist', async () => {
        const res = await request(app.getHttpServer())
          .patch('/devices/999999999')
          .send({ name: 'ghost' });

        expect(res.status).toBe(404);
      });

      it('returns 400 when typeId is not a number', async () => {
        const createdDevice = await createDisposableDevice();
        const res = await request(app.getHttpServer())
          .patch(`/devices/${createdDevice.id}`)
          .send({ typeId: 'not-a-number' });

        expect(res.status).toBe(400);
      });

      it('returns 400 when typeId references a non-existent device type', async () => {
        const createdDevice = await createDisposableDevice();

        const res = await request(app.getHttpServer())
          .patch(`/devices/${createdDevice.id}`)
          .send({ typeId: 999999999 });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/device type.*not found/i);

        const readRes = await request(app.getHttpServer()).get(
          `/devices/${createdDevice.id}`,
        );
        expect(readRes.status).toBe(200);
        expect(readRes.body.typeId).toBe(createdDevice.typeId);
      });

      it('returns 400 when id is not numeric', async () => {
        const res = await request(app.getHttpServer())
          .patch('/devices/abc')
          .send({ name: 'whatever' });

        expect(res.status).toBe(400);
      });
    });
  });

  describe('DELETE /devices/:id', () => {
    describe('success', () => {
      it('deletes the device and returns 200 with a confirmation message', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/devices')
          .send(buildPayload());
        expect(createRes.status).toBe(201);
        const createdDevice = createRes.body as DeviceResponseInterface;

        const deleteRes = await request(app.getHttpServer()).delete(
          `/devices/${createdDevice.id}`,
        );

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body).toMatchObject({
          message: expect.stringContaining(String(createdDevice.id)),
        });

        const readRes = await request(app.getHttpServer()).get(
          `/devices/${createdDevice.id}`,
        );
        expect(readRes.status).toBe(404);
      });
    });

    describe('parameter validation', () => {
      it('returns 404 when the device does not exist', async () => {
        const res = await request(app.getHttpServer()).delete(
          '/devices/999999999',
        );
        expect(res.status).toBe(404);
      });

      it('returns 400 when id is not numeric', async () => {
        const res = await request(app.getHttpServer()).delete('/devices/abc');
        expect(res.status).toBe(400);
      });
    });
  });
});

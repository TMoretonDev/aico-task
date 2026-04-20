import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import type { DeviceTypeResponseInterface } from '@aico-task/shared-types';
import { AppModule } from '../app.module';

describe('Device Types API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /device-types', () => {
    describe('success', () => {
      it('returns 200 with an array of seeded device types', async () => {
        const res = await request(app.getHttpServer()).get('/device-types');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        const first = res.body[0] as DeviceTypeResponseInterface;
        expect(first).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
        });
        if (first.description !== null) {
          expect(typeof first.description).toBe('string');
        }
      });

      it('includes each of the three seeded type names', async () => {
        const expectedNames = [
          'Smoke Alarm',
          'Heat Sensor',
          'Black Mould Sensor',
        ];

        const res = await request(app.getHttpServer()).get('/device-types');

        expect(res.status).toBe(200);
        const names = (res.body as DeviceTypeResponseInterface[]).map(
          (t) => t.name,
        );
        expectedNames.forEach((expected) => {
          expect(names).toContain(expected);
        });
      });
    });
  });
});

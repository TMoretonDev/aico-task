import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE } from '../db/database.tokens';
import * as schema from '../db/schema/index';
import {
  CreateDeviceInterface,
  DeviceResponseInterface,
  UpdateDeviceInterface,
} from '@aico-task/shared-types';

@Injectable()
export class DeviceRepository {
  constructor(
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findAll(): Promise<DeviceResponseInterface[]> {
    return this.db.select().from(schema.devices);
  }

  async findOneById(id: number): Promise<DeviceResponseInterface | undefined> {
    const [row] = await this.db
      .select()
      .from(schema.devices)
      .where(eq(schema.devices.id, id))
      .limit(1);
    return row;
  }

  async findOneBySerialNumber(
    serialNumber: string,
  ): Promise<DeviceResponseInterface | undefined> {
    const [row] = await this.db
      .select()
      .from(schema.devices)
      .where(eq(schema.devices.serialNumber, serialNumber))
      .limit(1);
    return row;
  }

  async createOne(
    data: CreateDeviceInterface,
  ): Promise<DeviceResponseInterface> {
    const [createdRow] = await this.db
      .insert(schema.devices)
      .values(data)
      .returning();
    return createdRow;
  }

  async updateOne(
    id: number,
    data: UpdateDeviceInterface,
  ): Promise<DeviceResponseInterface> {
    const [updatedRow] = await this.db
      .update(schema.devices)
      .set(data)
      .where(eq(schema.devices.id, id))
      .returning();
    return updatedRow;
  }

  async deleteOne(id: number): Promise<DeviceResponseInterface | undefined> {
    const [deletedRow] = await this.db
      .delete(schema.devices)
      .where(eq(schema.devices.id, id))
      .returning();
    return deletedRow;
  }
}

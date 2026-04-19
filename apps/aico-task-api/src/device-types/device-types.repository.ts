import { Inject, Injectable } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { DeviceTypeResponseInterface } from '@aico-task/shared-types';
import { DATABASE } from '../db/database.tokens';
import * as schema from '../db/schema/index';

@Injectable()
export class DeviceTypesRepository {
  constructor(
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findAll(): Promise<DeviceTypeResponseInterface[]> {
    return this.db.select().from(schema.deviceTypes);
  }
}

import { DataSource } from 'typeorm';

import { CreateUsers1700000000000 } from './migrations/1700000000000-CreateUsers.js';
import { Testing1759227992051 } from './migrations/1759227992051-Testing.js';
import { UserEntity } from '../modules/users/entities/User.entity.js';

export function createDataSource() {
  return new DataSource({
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [UserEntity],
    migrations: [CreateUsers1700000000000, Testing1759227992051],
    migrationsTableName: 'migrations',
  });
}

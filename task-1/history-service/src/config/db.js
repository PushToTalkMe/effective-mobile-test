import { DataSource } from 'typeorm';
import { ActionLogs } from '../entities/action-logs.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'history',
  synchronize: true,
  logging: true,
  entities: [ActionLogs],
  subscribers: [],
  migrations: [],
});

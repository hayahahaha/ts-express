import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    __dirname + '/../**/*.Entity{.ts,.js}',
  ],
  synchronize: true,
};

export default config;

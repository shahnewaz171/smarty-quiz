import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { config } from 'dotenv';

import * as schema from './schema.js';
import * as relations from './relations.js';

config();

const client = new Client({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

client
  .connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

export const db = drizzle(client, { schema: { ...schema, ...relations } });

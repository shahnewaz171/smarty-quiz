import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // url: process.env.DATABASE_URL!
    host: process.env.PGHOST!,
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    database: process.env.PGDATABASE!
  },
  verbose: true,
  strict: true
});

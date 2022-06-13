import 'dotenv/config';
import { Pool } from 'pg';

export default new Pool({
  connectionString:
    process.env.DB_STRING ||
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/postgres`,
  ssl: {
    rejectUnauthorized: false,
  },
});

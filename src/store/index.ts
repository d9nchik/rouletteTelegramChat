import 'dotenv/config';
import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DB_STRING ||
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/postgres`,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const transaction = async (
  transactionFunction: (client: PoolClient) => Promise<boolean>
): Promise<boolean> => {
  try {
    // You must use the same client instance for all statements within a transaction.
    // PostgreSQL isolates a transaction to individual clients.
    // This means if you initialize or use transactions with the pool.query method
    // you will have problems.Do not use transactions with the pool.query method.
    const client = await pool.connect();
    await client.query('BEGIN');
    const result = await transactionFunction(client);
    if (result) {
      await client.query('COMMIT');
    } else {
      await client.query('ROLLBACK');
    }
    client.release();
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default pool;

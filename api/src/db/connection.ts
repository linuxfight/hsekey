import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';
import "dotenv";

if (!Bun.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const client = new SQL(Bun.env.DATABASE_URL!);

export const db = drizzle({ client });

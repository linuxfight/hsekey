import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);

export const db = drizzle({ client });

await migrate(db, { migrationsFolder: './drizzle' });


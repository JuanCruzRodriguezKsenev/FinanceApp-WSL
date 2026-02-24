import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sql = neon(process.env.DATABASE_URL);

// Logueamos solo el host para seguridad
const dbHost = new URL(process.env.DATABASE_URL).host;
console.log(`🔌 DB Connection (HTTP) initialized to host: ${dbHost}`);

export const db = drizzle(sql, { schema });


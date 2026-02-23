import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Usamos neon-http por ser amigable con entornos Edge/Serverless.
const sql = neon(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/finance_app');

export const db = drizzle(sql);

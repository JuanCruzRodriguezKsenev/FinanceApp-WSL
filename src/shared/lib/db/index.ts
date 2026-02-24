import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Configuración para entornos Node.js (Vercel lo maneja nativamente)
if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Logueamos solo el host para seguridad
const dbHost = new URL(process.env.DATABASE_URL).host;
console.log(`🔌 DB Connection initialized to host: ${dbHost}`);

export const db = drizzle(pool);

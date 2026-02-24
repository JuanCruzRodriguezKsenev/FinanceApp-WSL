import { db } from "../src/shared/lib/db/index";
import { sql } from "drizzle-orm";

async function check() {
  console.log("Checking DB connection...");
  try {
    const result = await db.execute(sql`SELECT 1 as health`);
    console.log("Health check success:", result);
  } catch (error) {
    console.error("Health check failure:", error);
  }
}

check();

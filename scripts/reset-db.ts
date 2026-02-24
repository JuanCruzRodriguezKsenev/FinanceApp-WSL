import { db } from "../src/shared/lib/db/index";
import { sql } from "drizzle-orm";

async function reset() {
  console.log("🧨 Resetting database...");
  try {
    // Usamos SQL puro para mayor velocidad y limpieza total
    await db.execute(sql`TRUNCATE TABLE bank_accounts, transactions, digital_wallets CASCADE`);
    console.log("✅ Database cleared successfully.");
  } catch (error) {
    console.error("❌ Reset failed:", error);
  }
}

reset();

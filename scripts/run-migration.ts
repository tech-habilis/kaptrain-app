import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

async function runMigration() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const migrationPath = path.join(__dirname, "../supabase-migrations/001_create_complete_profile_tables.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");

  // Split by semicolon and execute each statement
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\n[${i + 1}/${statements.length}] Executing:`);
    console.log(statement.substring(0, 100) + (statement.length > 100 ? "..." : ""));

    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_query: statement,
      });

      if (error) {
        console.error(`Error:`, error);
      } else {
        console.log(`Success!`);
      }
    } catch (err: any) {
      console.error(`Exception:`, err.message);
    }
  }

  console.log("\n✅ Migration completed!");
}

runMigration().catch(console.error);

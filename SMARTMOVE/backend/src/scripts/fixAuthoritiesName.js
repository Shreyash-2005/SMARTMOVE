// One-off repair script for the "Unknown column 'a.name' in field list" error.
//
// Adds the missing `name` column to `authorities` if an older install left
// it out, and seeds a default authority row so issue-report joins resolve.
//
// Run from the backend/ folder:
//   node src/scripts/fixAuthoritiesName.js

import { pool } from "../config/db.js";

async function main() {
  const conn = await pool.getConnection();
  try {
    const [cols] = await conn.query(
      `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'authorities' AND COLUMN_NAME = 'name'`
    );

    if (cols[0].c === 0) {
      console.log("Column authorities.name is missing — adding it...");
      await conn.query(
        `ALTER TABLE authorities ADD COLUMN name VARCHAR(150) NOT NULL DEFAULT '' AFTER id`
      );
      console.log("✔ authorities.name column added.");
    } else {
      console.log("✔ authorities.name already exists — nothing to change.");
    }

    const [rows] = await conn.query(`SELECT COUNT(*) AS c FROM authorities`);
    if (rows[0].c === 0) {
      console.log("authorities table is empty — inserting a default row...");
      await conn.query(
        `INSERT INTO authorities (name, department, officer_name, email, phone, area)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "City Mobility Authority",
          "Traffic & Transport",
          "Duty Officer",
          "authority@smartmove.local",
          "",
          "Citywide",
        ]
      );
      console.log("✔ Default authority row created.");
    }

    console.log("\nDone. Restart the backend server if it's already running.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

main();

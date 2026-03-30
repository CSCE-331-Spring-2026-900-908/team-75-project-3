import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "csce-315-db.engr.tamu.edu",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "team_75_db",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false },
});

export default pool;

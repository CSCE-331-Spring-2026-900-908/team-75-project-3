import pool from "@/lib/db";
import { MenuItem } from "@/lib/types";

export async function getMenu(): Promise<MenuItem[]> {
  const { rows } = await pool.query(
    "SELECT itemid, itemname, category, price, description FROM menu ORDER BY itemid"
  );
  return rows;
}

export async function getMenuByCategory(category: string): Promise<MenuItem[]> {
  const { rows } = await pool.query(
    "SELECT itemid, itemname, category, price, description FROM menu WHERE category = $1 ORDER BY itemid",
    [category]
  );
  return rows;
}

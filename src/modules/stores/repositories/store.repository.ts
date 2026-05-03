import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

export const findRegionById = async (regionId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM region WHERE id = ?;`,
    [regionId]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const addStore = async (regionId: number, data: any): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO store (region_id, name, address, score)
     VALUES (?, ?, ?, ?);`,
    [regionId, data.name, data.address, data.score ?? null]
  );

  return result.insertId;
};

export const getStore = async (storeId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM store WHERE id = ?;`,
    [storeId]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};
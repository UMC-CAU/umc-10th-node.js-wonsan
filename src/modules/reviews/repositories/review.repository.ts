import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

export const findStoreById = async (storeId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM store WHERE id = ?;`,
    [storeId]
  );

  if (rows.length === 0) return null;

  return rows[0];
};

export const findMemberById = async (memberId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM member WHERE id = ?;`,
    [memberId]
  );

  if (rows.length === 0) return null;

  return rows[0];
};

export const addReview = async (
  storeId: number,
  data: any
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO review (member_id, store_id, body, score)
     VALUES (?, ?, ?, ?);`,
    [data.memberId, storeId, data.body, data.score]
  );

  return result.insertId;
};

export const getReview = async (reviewId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM review WHERE id = ?;`,
    [reviewId]
  );

  if (rows.length === 0) return null;

  return rows[0];
};
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

export const addMission = async (
  storeId: number,
  data: any
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO mission (store_id, reward, deadline, mission_spec)
     VALUES (?, ?, ?, ?);`,
    [storeId, data.reward, data.deadline, data.missionSpec]
  );

  return result.insertId;
};

export const getMission = async (missionId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM mission WHERE id = ?;`,
    [missionId]
  );

  if (rows.length === 0) return null;

  return rows[0];
};

export const findMissionByStoreAndMissionId = async (
  storeId: number,
  missionId: number
) => {
  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM mission
    WHERE id = ?
      AND store_id = ?
    `,
    [missionId, storeId]
  );

  return rows[0];
};

export const findChallengingMission = async (
  memberId: number,
  missionId: number
) => {
  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM member_mission
    WHERE member_id = ?
      AND mission_id = ?
      AND status = 'challenging'
    `,
    [memberId, missionId]
  );

  return rows[0];
};

export const insertMemberMission = async (
  memberId: number,
  missionId: number
) => {
  const [result]: any = await pool.query(
    `
    INSERT INTO member_mission (
      member_id,
      mission_id,
      status,
      created_at,
      updated_at
    )
    VALUES (?, ?, 'challenging', NOW(), NOW())
    `,
    [memberId, missionId]
  );

  return result.insertId;
};
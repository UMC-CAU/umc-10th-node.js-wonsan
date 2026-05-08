import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool, prisma } from "../../../db.config.js";

export const getStoreMissions = async (
  storeId: number,
  cursor: number,
  limit: number = 10
) => {
  const missions = await prisma.mission.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: cursor,
    take: limit + 1,
  });

  return missions;
};

export const findStoreById = async (storeId: number): Promise<any | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM store WHERE id = ?;`,
    [storeId]
  );

  if (rows.length === 0) return null;

  return rows[0];
};

export const addMission = async (data: {
  storeId: number;
  content: string;
  point: number;
  deadline: Date;
}) => {
  const mission = await prisma.mission.create({
    data: {
      storeId: data.storeId,
      content: data.content,
      point: data.point,
      deadline: data.deadline,
    },
  });

  return mission.id;
};

export const getMission = async (missionId: number) => {
  return await prisma.mission.findUniqueOrThrow({
    where: {
      id: missionId,
    },
    include: {
      store: true,
    },
  });
};
export const findUserMission = async (data: {
  userId: number;
  missionId: number;
}) => {
  return await prisma.userMission.findUnique({
    where: {
      userId_missionId: {
        userId: data.userId,
        missionId: data.missionId,
      },
    },
  });
};

export const addUserMission = async (data: {
  userId: number;
  missionId: number;
  status: string;
}) => {
  return await prisma.userMission.create({
    data: {
      userId: data.userId,
      missionId: data.missionId,
      status: data.status,
    },
  });
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
  userId: number,
  missionId: number
) => {
  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM user_mission
    WHERE user_id = ?
      AND mission_id = ?
      AND status = 'challenging'
    `,
    [userId, missionId]
  );

  return rows[0];
};

export const insertUserMission = async (
  userId: number,
  missionId: number
) => {
  const [result]: any = await pool.query(
    `
    INSERT INTO user_mission (
      user_id,
      mission_id,
      status,
      created_at,
      updated_at
    )
    VALUES (?, ?, 'challenging', NOW(), NOW())
    `,
    [userId, missionId]
  );

  return result.insertId;
};

export const getOngoingUserMissions = async (
  userId: number,
  cursor: number,
  limit: number = 10
) => {
  const userMissions = await prisma.userMission.findMany({
    where: {
      userId,
      status: "challenging",
    },
    include: {
      mission: {
        include: {
          store: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: cursor,
    take: limit + 1,
  });

  return userMissions;
};

export const updateUserMissionToCompleted = async (data: {
  userId: number;
  missionId: number;
}) => {
  return await prisma.userMission.update({
    where: {
      userId_missionId: {
        userId: data.userId,
        missionId: data.missionId,
      },
    },
    data: {
      status: "completed",
    },
  });
};
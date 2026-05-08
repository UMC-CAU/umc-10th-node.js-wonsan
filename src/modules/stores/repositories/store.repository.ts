import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool, prisma } from "../../../db.config.js";

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


export const addStore = async (data: {
  regionId: number;
  name: string;
  address: string;
}) => {
  const store = await prisma.store.create({
    data: {
      regionId: data.regionId,
      name: data.name,
      address: data.address,
    },
  });

  return store.id;
};

export const getStore = async (storeId: number) => {
  return await prisma.store.findUniqueOrThrow({
    where: {
      id: storeId,
    },
    include: {
      region: true,
    },
  });
};


export const getAllStoreReviews = async (
  storeId: number,
  cursor: number
) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      rating: true,
      createdAt: true,
      storeId: true,
      userId: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      storeId,
      ...(cursor !== 0 && {
        id: {
          lt: cursor,
        },
      }),
    },
    orderBy: {
      id: "desc",
    },
    take: 10,
  });

  return reviews;
};
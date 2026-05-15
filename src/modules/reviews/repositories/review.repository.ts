import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { prisma } from "../../../db.config.js";


export const findStoreById = async (storeId: number) => {
  return await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
};

export const findUserById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const addReview = async (data: {
  userId: number;
  storeId: number;
  content: string;
  rating: number;
}) => {
  const review = await prisma.review.create({
    data: {
      userId: data.userId,
      storeId: data.storeId,
      content: data.content,
      rating: data.rating,
    },
  });

  return review.id;
};

export const getReview = async (reviewId: number) => {
  return await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: true,
      store: true,
    },
  });
};

export const getStoreReviews = async (storeId: number) => {
  return await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      },
    },
  });
};

export const getMyReviews = async (
  userId: number,
  cursor: number,
  limit: number = 10
) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId: userId,
    },
    include: {
      store: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: cursor,
    take: limit + 1,
  });

  return reviews;
};


// export const addReview = async (
//   storeId: number,
//   data: any
// ): Promise<number> => {
//   const [result] = await pool.query<ResultSetHeader>(
//     `INSERT INTO review (member_id, store_id, body, score)
//      VALUES (?, ?, ?, ?);`,
//     [data.memberId, storeId, data.body, data.score]
//   );

//   return result.insertId;
// };

// export const getReview = async (reviewId: number): Promise<any | null> => {
//   const [rows] = await pool.query<RowDataPacket[]>(
//     `SELECT * FROM review WHERE id = ?;`,
//     [reviewId]
//   );

//   if (rows.length === 0) return null;

//   return rows[0];
// };
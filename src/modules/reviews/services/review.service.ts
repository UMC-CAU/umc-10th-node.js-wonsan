import {
  ReviewCreateRequest,
  ReviewListResponse,
  ReviewCreateResponse,
  responseFromMyReviews,
} from "../dtos/review.dto.js";

import {
  findStoreById,
  findUserById,
  addReview,
  getReview,
  getStoreReviews,
  getMyReviews,
} from "../repositories/review.repository.js";

import { AppError } from "../../../common/errors/app.error.js";
import { StatusCodes } from "http-status-codes";


export const createReview = async (
  storeId: number,
  data: ReviewCreateRequest
): Promise<ReviewCreateResponse> => {
  // 1. 가게 존재 여부 확인
  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "STORE404",
      message: "존재하지 않는 가게입니다.",
    });
  }

  // 2. 유저 존재 여부 확인
  const user = await findUserById(data.userId);

  if (!user) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "USER404",
      message: "존재하지 않는 사용자입니다.",
    });
  }

  // 3. 리뷰 생성
  const reviewId = await addReview({
    storeId,
    userId: data.userId,
    content: data.content,
    rating: data.rating,
  });

  // 4. 생성된 리뷰 재조회
  const review = await getReview(reviewId);

  if (!review) {
    throw new AppError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorCode: "REVIEW500",
      message: "리뷰 생성 후 조회에 실패했습니다.",
    });
  }

  // 5. 응답 형식 가공
  return {
    reviewId: review.id,
    storeId: review.storeId,
    storeName: review.store.name,
    userId: review.userId,
    nickname: review.user.name,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt,
  };
};

export const listStoreReviews = async (
  storeId: number
): Promise<ReviewListResponse> => {
  const store = await getStoreReviews(storeId);

  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  return {
    storeId: store.id,
    storeName: store.name,
    reviews: store.reviews.map((review:any) => ({
      reviewId: review.id,
      nickname: review.user.name,
      rating: review.rating,
      createdAt: review.createdAt,
      content: review.content,
    })),
  };
};

export const listMyReviews = async (userId: number, cursor: number) => {
  const reviews = await getMyReviews(userId, cursor);

  return responseFromMyReviews(reviews, cursor);
};
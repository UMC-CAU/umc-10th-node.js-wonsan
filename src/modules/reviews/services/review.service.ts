import {
  ReviewCreateRequest,
  ReviewListResponse,
  ReviewCreateResponse,
  responseFromMyReviews,
} from "../dtos/review.dto.js";

import {
  findStoreById,
  findMemberById,
  addReview,
  getReview,
  getStoreReviews,
  getMyReviews,
} from "../repositories/review.repository.js";

export const createReview = async (
  storeId: number,
  data: ReviewCreateRequest
): Promise<ReviewCreateResponse> => {
  const reviewId = await addReview({
    storeId,
    userId: data.userId,
    content: data.content,
    rating: data.rating,
  });

  const review = await getReview(reviewId);

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
export interface ReviewCreateRequest {
  userId: number;
  rating: number;
  content: string;
}

export interface ReviewCreateResponse {
  reviewId: number;
  storeId: number;
  storeName: string;
  userId: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface ReviewListItem {
  reviewId: number;
  nickname: string;
  rating: number;
  createdAt: Date;
  content: string;
}

export interface ReviewListResponse {
  storeId: number;
  storeName: string;
  reviews: ReviewListItem[];
}


export const bodyToReview = (body: ReviewCreateRequest) => {
  return {
    memberId: body.userId,
    score: body.rating,
    body: body.content,
  };
};


export const responseFromMyReviews = (reviews: any[], cursor: number, limit: number = 10) => {
  const hasNext = reviews.length > limit;

  const slicedReviews = hasNext ? reviews.slice(0, limit) : reviews;

  return {
    reviews: slicedReviews.map((review) => ({
      reviewId: review.id,
      storeId: review.store.id,
      storeName: review.store.name,
      rating: review.rating,
      content: review.content,
      createdAt: review.createdAt.toISOString().slice(0, 10).replaceAll("-", "."),
      images: review.images.map((image: any) => image.imageUrl),
    })),
    pagination: {
      cursor: cursor + slicedReviews.length,
      hasNext,
    },
  };
};
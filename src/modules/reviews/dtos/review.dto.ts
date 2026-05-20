export interface ReviewCreateRequest {
  /** 리뷰를 작성하는 사용자 ID */
  userId: number;
  /** 리뷰 별점 */
  rating: number;
  /** 리뷰 내용 */
  content: string;
}

export interface ReviewCreateResponse {
  /** 생성된 리뷰 ID */
  reviewId: number;
  /** 리뷰가 작성된 가게 ID */
  storeId: number;
  /** 리뷰가 작성된 가게 이름 */
  storeName: string;
  /** 리뷰 작성자 ID */
  userId: number;
  /** 리뷰 작성자 닉네임 */
  nickname: string;
  /** 리뷰 별점 */
  rating: number;
  /** 리뷰 내용 */
  content: string;
  /** 리뷰 작성 일시 */
  createdAt: Date;
}

export interface ReviewListItem {
  /** 리뷰 ID */
  reviewId: number;
  /** 리뷰 작성자 닉네임 */
  nickname: string;
  /** 리뷰 별점 */
  rating: number;
  /** 리뷰 작성 일시 */
  createdAt: Date;
  /** 리뷰 내용 */
  content: string;
}

export interface ReviewListResponse {
  /** 가게 ID */
  storeId: number;
  /** 가게 이름 */
  storeName: string;
  /** 리뷰 목록 */
  reviews: ReviewListItem[];
}

export interface MyReviewListItem {
  /** 리뷰 ID */
  reviewId: number;
  /** 가게 ID */
  storeId: number;
  /** 가게 이름 */
  storeName: string;
  /** 리뷰 별점 */
  rating: number;
  /** 리뷰 내용 */
  content: string;
  /** 리뷰 작성일 */
  createdAt: string;
  /** 리뷰 이미지 URL 목록 */
  images: string[];
}

export interface MyReviewListResponse {
  /** 내가 작성한 리뷰 목록 */
  reviews: MyReviewListItem[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 다음 조회에 사용할 cursor */
    cursor: number;
    /** 다음 페이지 존재 여부 */
    hasNext: boolean;
  };
}

export const bodyToReview = (body: ReviewCreateRequest) => {
  return {
    memberId: body.userId,
    score: body.rating,
    body: body.content,
  };
};


export const responseFromMyReviews = (reviews: any[], cursor: number, limit: number = 10): MyReviewListResponse => {
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

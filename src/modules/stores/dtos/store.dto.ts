export interface StoreCreateRequest {
  /** 가게 이름 */
  name: string;
  /** 가게 주소 */
  address: string;
  /** 가게 평점 */
  score?: number;
}

export interface StoreCreateResponse {
  /** 생성된 가게 ID */
  storeId: number;
  /** 가게 이름 */
  name: string;
  /** 가게 주소 */
  address: string;
  /** 가게가 속한 지역 ID */
  regionId: number;
  /** 가게가 속한 지역 이름 */
  regionName: string;
}

export const bodyToStore = (body: StoreCreateRequest) => {
  return {
    name: body.name,
    address: body.address,
    score: body.score ?? null,
  };
};

export const responseFromStore = (store: any) => {
  return {
    storeId: store.id,
    regionId: store.region_id,
    name: store.name,
    address: store.address,
    score: store.score,
    createdAt: store.created_at,
    updatedAt: store.updated_at,
  };
};


// export interface ReviewListResponse {
//   storeId: number;
//   storeName: string;
//   reviews: {
//     reviewId: number;
//     nickname: string;
//     rating: number;
//     content: string;
//     createdAt: Date;
//   }[];
// }

// export const responseFromReviews = (reviews: any[]): ReviewListResponse => {
//   const firstReview = reviews[0];

//   return {
//     storeId: firstReview?.storeId ?? 0,
//     storeName: firstReview?.store?.name ?? "",
//     reviews: reviews.map((review) => ({
//       reviewId: review.id,
//       nickname: review.user?.name ?? "",
//       rating: review.rating,
//       content: review.content,
//       createdAt: review.createdAt,
//     })),
//   };
// };

export interface ReviewItem {
  id: number;
  content: string;
  rating: number;
  createdAt: Date;
  storeId: number;
  userId: number;
  store?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

export interface ReviewListResponse {
  data: {
    reviewId: number;
    nickname: string;
    rating: number;
    content: string;
    createdAt: Date;
  }[];
  pagination: {
    cursor: number | null;
  };
}

export const responseFromReviews = (
  reviews: ReviewItem[]
): ReviewListResponse => {
  const lastReview = reviews[reviews.length - 1];

  return {
    data: reviews.map((review) => ({
      reviewId: review.id,
      nickname: review.user?.name ?? "",
      rating: review.rating,
      content: review.content,
      createdAt: review.createdAt,
    })),
    pagination: {
      cursor: lastReview ? lastReview.id : null,
    },
  };
};

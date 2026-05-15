import {
  StoreCreateRequest,
  StoreCreateResponse,
  ReviewListResponse,
  responseFromReviews,
} from "../dtos/store.dto.js";

import {
  addStore,
  findRegionById,
  getStore,
  getAllStoreReviews,
} from "../repositories/store.repository.js";

import { AppError } from "../../../common/errors/app.error.js";
import { StatusCodes } from "http-status-codes";

export const createStore = async (
  regionId: number,
  data: StoreCreateRequest
): Promise<StoreCreateResponse> => {
  // 1. 지역이 실제 존재하는지 확인
  const region = await findRegionById(regionId);

  if (!region) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "STORE404",
      message: "해당 지역을 찾을 수 없습니다.",
    });
  }

  // 2. 가게 추가
  const storeId = await addStore({
    regionId,
    name: data.name,
    address: data.address,
  });

  // 3. 방금 생성한 가게 조회
  const store = await getStore(storeId);

  if (!store) {
    throw new AppError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorCode: "STORE500",
      message: "가게 생성 후 조회에 실패했습니다.",
    });
  }

  // 4. 응답 DTO 반환
  return {
    storeId: store.id,
    name: store.name,
    address: store.address,
    regionId: store.regionId,
    regionName: store.region.name,
  };
};

export const listStoreReviews = async (
  storeId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};
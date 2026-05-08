import {
  StoreCreateRequest,
  StoreCreateResponse,
  bodyToStore,
  responseFromStore,
  ReviewListResponse,
  responseFromReviews,
} from "../dtos/store.dto.js";

import {
  addStore,
  findRegionById,
  getStore,
  getAllStoreReviews,
} from "../repositories/store.repository.js";

export const createStore = async (
  regionId: number,
  data: StoreCreateRequest
): Promise<StoreCreateResponse> => {
  const storeId = await addStore({
    regionId,
    name: data.name,
    address: data.address,
  });

  const store = await getStore(storeId);

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
  cursor:number
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};
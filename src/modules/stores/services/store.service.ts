import { StoreCreateRequest, bodyToStore, responseFromStore } from "../dtos/store.dto.js";
import { addStore, findRegionById, getStore } from "../repositories/store.repository.js";

export const createStore = async (regionId: number, body: StoreCreateRequest) => {
  if (!body.name || !body.address) {
    throw new Error("가게 이름과 주소는 필수입니다.");
  }

  const region = await findRegionById(regionId);

  if (!region) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const storeData = bodyToStore(body);

  const storeId = await addStore(regionId, storeData);

  const store = await getStore(storeId);

  if (!store) {
    throw new Error("가게 정보를 찾을 수 없습니다.");
  }

  return responseFromStore(store);
};
export interface StoreCreateRequest {
  name: string;
  address: string;
  score?: number;
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
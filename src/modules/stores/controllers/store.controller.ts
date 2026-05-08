import { Request, Response, NextFunction } from "express";
import { createStore, listStoreReviews } from "../services/store.service.js";
import type { StoreCreateRequest } from "../dtos/store.dto.js";
import { StatusCodes } from "http-status-codes";


export const handleCreateStore = async (req: Request, res: Response) => {
  try {
    const regionId = Number(req.params.regionId);

    if (Number.isNaN(regionId)) {
      return res.status(400).json({
        success: false,
        code: "STORE400",
        message: "regionId가 올바르지 않습니다.",
      });
    }

    const result = await createStore(regionId, req.body);

    return res.status(201).json({
      success: true,
      code: "COMMON201",
      message: "가게 생성 성공",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "STORE400",
      message: error instanceof Error ? error.message : "가게 생성 실패",
    });
  }
};

export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    const cursor =
    typeof req.query.cursor === "string"
      ? parseInt(req.query.cursor, 10)
      : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};
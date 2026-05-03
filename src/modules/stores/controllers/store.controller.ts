import { Request, Response } from "express";
import { createStore } from "../services/store.service.js";
import type { StoreCreateRequest } from "../dtos/store.dto.js";

export const handleCreateStore = async (req: Request, res: Response) => {
  try {
    const regionId = Number(req.params.regionId);
    const body: StoreCreateRequest = req.body;

    if (Number.isNaN(regionId)) {
      return res.status(400).json({
        success: false,
        code: "B400",
        message: "regionId는 숫자여야 합니다.",
      });
    }

    const result = await createStore(regionId, body);

    return res.status(201).json({
      success: true,
      code: "S201",
      message: "가게 추가 성공",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      code: "B400",
      message: err.message,
    });
  }
};
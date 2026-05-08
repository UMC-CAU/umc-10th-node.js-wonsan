import { Request, Response, NextFunction } from "express";
import { createReview, listStoreReviews, listMyReviews } from "../services/review.service.js";
import type { ReviewCreateRequest } from "../dtos/review.dto.js";
export const handleCreateReview = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);

    if (Number.isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        code: "REVIEW400",
        message: "storeId가 올바르지 않습니다.",
      });
    }

    const result = await createReview(storeId, req.body);

    return res.status(201).json({
      success: true,
      code: "COMMON201",
      message: "리뷰 작성 성공",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "REVIEW400",
      message: error instanceof Error ? error.message : "리뷰 작성 실패",
    });
  }
};

export const handleListStoreReviews = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);

    if (Number.isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        code: "REVIEW400",
        message: "storeId가 올바르지 않습니다.",
      });
    }

    const result = await listStoreReviews(storeId);

    return res.status(200).json({
      success: true,
      code: "COMMON200",
      message: "리뷰 목록 조회 성공",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "REVIEW400",
      message: error instanceof Error ? error.message : "리뷰 목록 조회 실패",
    });
  }
};


export const handleListMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const cursor = Number(req.query.cursor ?? 0);

    // 로그인 기능이 아직 없으면 임시로 1번 유저 사용


    const result = await listMyReviews(userId, cursor);

    return res.status(200).json({
      success: true,
      code: "S200",
      message: "내가 작성한 리뷰 목록 조회 성공",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
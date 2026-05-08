import { Request, Response, NextFunction } from "express";
import { createMission, challengeMission,listStoreMissions, listOngoingUserMissions,completeUserMission } from "../services/mission.service.js";
import type { MissionCreateRequest } from "../dtos/mission.dto.js";


import {
  addMission,
  getMission,
  findUserMission,
  addUserMission,
} from "../repositories/mission.repository.js";

export const handleCreateMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);

    if (Number.isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        code: "MISSION400",
        message: "storeId가 올바르지 않습니다.",
      });
    }

    const result = await createMission(storeId, req.body);

    return res.status(201).json({
      success: true,
      code: "COMMON201",
      message: "미션 생성 성공",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "MISSION400",
      message: error instanceof Error ? error.message : "미션 생성 실패",
    });
  }
};

export const handleChallengeMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);

    if (Number.isNaN(storeId) || Number.isNaN(missionId)) {
      return res.status(400).json({
        success: false,
        code: "MISSION400",
        message: "storeId 또는 missionId가 올바르지 않습니다.",
      });
    }

    const result = await challengeMission(storeId, missionId, req.body);

    return res.status(201).json({
      success: true,
      code: "COMMON201",
      message: "미션 도전 성공",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "MISSION400",
      message: error instanceof Error ? error.message : "미션 도전 실패",
    });
  }
};

export const handleListStoreMissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = Number(req.params.storeId);
    const cursor = Number(req.query.cursor ?? 0);

    const result = await listStoreMissions(storeId, cursor);

    return res.status(200).json({
      success: true,
      code: "S200",
      message: "특정 가게의 미션 목록 조회 성공",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const handleListOngoingUserMissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const cursor = Number(req.query.cursor ?? 0);

    const result = await listOngoingUserMissions(userId, cursor);

    return res.status(200).json({
      success: true,
      code: "S200",
      message: "내가 진행 중인 미션 목록 조회 성공",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCompleteUserMission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const missionId = Number(req.params.missionId);

    const result = await completeUserMission(userId, missionId);

    return res.status(200).json({
      success: true,
      code: "S200",
      message: "진행 중인 미션을 완료했습니다.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

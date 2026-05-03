import { Request, Response } from "express";
import { createMission } from "../services/mission.service.js";
import type { MissionCreateRequest } from "../dtos/mission.dto.js";

import { challengeMission } from "../services/mission.service.js";

export const handleCreateMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);
    const body: MissionCreateRequest = req.body;

    if (Number.isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        code: "B400",
        message: "storeId는 숫자여야 합니다.",
      });
    }

    const result = await createMission(storeId, body);

    return res.status(201).json({
      success: true,
      code: "S201",
      message: "미션 추가 성공",
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

export const handleChallengeMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const memberId = Number(req.body.memberId);

    if (Number.isNaN(storeId) || Number.isNaN(missionId) || Number.isNaN(memberId)) {
      return res.status(400).json({
        success: false,
        code: "C400",
        message: "storeId, missionId, memberId는 숫자여야 합니다.",
      });
    }

    const result = await challengeMission(storeId, missionId, memberId);

    return res.status(201).json({
      success: true,
      code: "S200",
      message: "미션 도전 성공",
      data: result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      code: error.code || "S500",
      message: error.message || "서버 오류가 발생했습니다.",
    });
  }
};
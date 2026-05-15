import {
  MissionCreateRequest,
  MissionCreateResponse,
  MissionChallengeRequest,
  MissionChallengeResponse,
  responseFromStoreMissions,
  responseFromOngoingUserMissions,
  responseFromCompletedUserMission,
} from "../dtos/mission.dto.js";

import {
  addMission,
  getMission,
  findUserMission,
  addUserMission,
  getStoreMissions,
  getOngoingUserMissions,
  updateUserMissionToCompleted,
  findStoreById,
  findUserById,
} from "../repositories/mission.repository.js"

import { AppError } from "../../../common/errors/app.error.js";
import { StatusCodes } from "http-status-codes";


export const createMission = async (
  storeId: number,
  data: MissionCreateRequest
): Promise<MissionCreateResponse> => {
  // 1. 가게 존재 여부 확인
  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "STORE404",
      message: "존재하지 않는 가게입니다.",
    });
  }

  // 2. 미션 생성
  const missionId = await addMission({
    storeId,
    content: data.content,
    point: data.point,
    deadline: new Date(data.deadline),
  });

  // 3. 생성한 미션 조회
  const mission = await getMission(missionId);

  if (!mission) {
    throw new AppError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorCode: "MISSION500",
      message: "미션 생성 후 조회에 실패했습니다.",
    });
  }

  // 4. 응답 데이터 반환
  return {
    missionId: mission.id,
    storeId: mission.storeId,
    storeName: mission.store.name,
    content: mission.content,
    point: mission.point,
    deadline: mission.deadline,
  };
};


export const challengeMission = async (
  storeId: number,
  missionId: number,
  data: MissionChallengeRequest
): Promise<MissionChallengeResponse> => {
  // 1. 미션 존재 여부 확인
  const mission = await getMission(missionId);

  if (!mission) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "MISSION404",
      message: "존재하지 않는 미션입니다.",
    });
  }

  // 2. 요청한 storeId의 미션이 맞는지 확인
  if (mission.storeId !== storeId) {
    throw new AppError({
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: "MISSION400",
      message: "해당 가게의 미션이 아닙니다.",
    });
  }

  // 3. 유저 존재 여부 확인
  const user = await findUserById(data.userId);

  if (!user) {
    throw new AppError({
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: "USER404",
      message: "존재하지 않는 사용자입니다.",
    });
  }

  // 4. 이미 도전한 미션인지 확인
  const existingMission = await findUserMission({
    userId: data.userId,
    missionId,
  });

  if (existingMission) {
    throw new AppError({
      statusCode: StatusCodes.CONFLICT,
      errorCode: "MISSION409",
      message: "이미 도전한 미션입니다.",
    });
  }

  // 5. 미션 도전 생성
  const userMission = await addUserMission({
    userId: data.userId,
    missionId,
    status: "challenging",
  });

  return {
    userMissionId: userMission.id,
    userId: userMission.userId,
    missionId: userMission.missionId,
    status: userMission.status,
  };
};

export const listStoreMissions = async (
  storeId: number,
  cursor: number
) => {
  const missions = await getStoreMissions(storeId, cursor);

  return responseFromStoreMissions(missions, cursor);
};

export const listOngoingUserMissions = async (
  userId: number,
  cursor: number
) => {
  const userMissions = await getOngoingUserMissions(userId, cursor);

  return responseFromOngoingUserMissions(userMissions, cursor);
};

export const completeUserMission = async (
  userId: number,
  missionId: number
) => {
  const userMission = await findUserMission({
    userId,
    missionId,
  });

  if (!userMission) {
    throw new Error("도전 중인 미션이 존재하지 않습니다.");
  }

  if (userMission.status !== "challenging") {
    throw new Error("진행 중인 미션만 완료할 수 있습니다.");
  }

  const completedUserMission = await updateUserMissionToCompleted({
    userId,
    missionId,
  });

  return responseFromCompletedUserMission(completedUserMission);
};
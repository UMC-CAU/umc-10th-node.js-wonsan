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
} from "../repositories/mission.repository.js"



export const createMission = async (
  storeId: number,
  data: MissionCreateRequest
): Promise<MissionCreateResponse> => {
  const missionId = await addMission({
    storeId,
    content: data.content,
    point: data.point,
    deadline: new Date(data.deadline),
  });

  const mission = await getMission(missionId);

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
  const mission = await getMission(missionId);

  if (mission.storeId !== storeId) {
    throw new Error("해당 가게의 미션이 아닙니다.");
  }

  const existingMission = await findUserMission({
    userId: data.userId,
    missionId,
  });

  if (existingMission) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  const userMission = await addUserMission({
    userId: data.userId,
    missionId,
    status: "CHALLENGING",
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
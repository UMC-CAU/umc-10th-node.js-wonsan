import {
  MissionCreateRequest,
  bodyToMission,
  responseFromMission,
} from "../dtos/mission.dto.js";

import {
  findStoreById,
  addMission,
  getMission,
} from "../repositories/mission.repository.js";

export const createMission = async (
  storeId: number,
  body: MissionCreateRequest
) => {
  if (!body.reward || !body.deadline || !body.missionSpec) {
    throw new Error("reward, deadline, missionSpec은 필수입니다.");
  }

  const store = await findStoreById(storeId);

  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionData = bodyToMission(body);

  const missionId = await addMission(storeId, missionData);

  const mission = await getMission(missionId);

  if (!mission) {
    throw new Error("미션 정보를 찾을 수 없습니다.");
  }

  return responseFromMission(mission);
};
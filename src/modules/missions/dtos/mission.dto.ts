export interface MissionCreateRequest {
  reward: number;
  deadline: string;
  missionSpec: string;
}

export const bodyToMission = (body: MissionCreateRequest) => {
  return {
    reward: body.reward,
    deadline: body.deadline,
    missionSpec: body.missionSpec,
  };
};

export const responseFromMission = (mission: any) => {
  return {
    missionId: mission.id,
    storeId: mission.store_id,
    reward: mission.reward,
    deadline: mission.deadline,
    missionSpec: mission.mission_spec,
    createdAt: mission.created_at,
    updatedAt: mission.updated_at,
  };
};
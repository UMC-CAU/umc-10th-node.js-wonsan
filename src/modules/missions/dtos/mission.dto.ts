export interface MissionCreateRequest {
  content: string;
  point: number;
  deadline: string;
}

export interface MissionCreateResponse {
  missionId: number;
  storeId: number;
  storeName: string;
  content: string;
  point: number;
  deadline: Date;
}

export interface MissionChallengeRequest {
  userId: number;
}

export interface MissionChallengeResponse {
  userMissionId: number;
  userId: number;
  missionId: number;
  status: string;
}

export const bodyToMission = (body: MissionCreateRequest) => {
  return {
    reward: body.point,
    deadline: body.deadline,
    missionSpec: body.content,
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
}

export const responseFromStoreMissions = (
  missions: any[],
  cursor: number,
  limit: number = 10
) => {
  const hasNext = missions.length > limit;
  const slicedMissions = hasNext ? missions.slice(0, limit) : missions;

  return {
    missions: slicedMissions.map((mission: any) => ({
      missionId: mission.id,
      content: mission.content,
      point: mission.point,
      deadline: mission.deadline.toISOString().slice(0, 10).replaceAll("-", "."),
      createdAt: mission.createdAt.toISOString().slice(0, 10).replaceAll("-", "."),
    })),
    pagination: {
      cursor: cursor + slicedMissions.length,
      hasNext,
    },
  };
};

export const responseFromOngoingUserMissions = (
  userMissions: any[],
  cursor: number,
  limit: number = 10
) => {
  const hasNext = userMissions.length > limit;

  const slicedUserMissions = hasNext
    ? userMissions.slice(0, limit)
    : userMissions;

  return {
    missions: slicedUserMissions.map((userMission: any) => ({
      userMissionId: userMission.id,
      missionId: userMission.mission.id,
      storeId: userMission.mission.store.id,
      storeName: userMission.mission.store.name,
      content: userMission.mission.content,
      point: userMission.mission.point,
      deadline: userMission.mission.deadline
        .toISOString()
        .slice(0, 10)
        .replaceAll("-", "."),
      status: userMission.status,
      challengedAt: userMission.createdAt
        .toISOString()
        .slice(0, 10)
        .replaceAll("-", "."),
    })),
    pagination: {
      cursor: cursor + slicedUserMissions.length,
      hasNext,
    },
  };
};

export const responseFromCompletedUserMission = (userMission: any) => {
  return {
    userMissionId: userMission.id,
    userId: userMission.userId,
    missionId: userMission.missionId,
    status: userMission.status,
    completedAt: userMission.updatedAt
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "."),
  };
};
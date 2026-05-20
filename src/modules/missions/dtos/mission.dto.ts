export interface MissionCreateRequest {
  /** 미션 내용 */
  content: string;
  /** 미션 완료 보상 포인트 */
  point: number;
  /** 미션 마감일 */
  deadline: string;
}

export interface MissionCreateResponse {
  /** 생성된 미션 ID */
  missionId: number;
  /** 미션이 속한 가게 ID */
  storeId: number;
  /** 미션이 속한 가게 이름 */
  storeName: string;
  /** 미션 내용 */
  content: string;
  /** 미션 완료 보상 포인트 */
  point: number;
  /** 미션 마감일 */
  deadline: Date;
}

export interface MissionChallengeRequest {
  /** 미션에 도전하는 사용자 ID */
  userId: number;
}

export interface MissionChallengeResponse {
  /** 사용자 미션 ID */
  userMissionId: number;
  /** 미션에 도전한 사용자 ID */
  userId: number;
  /** 도전한 미션 ID */
  missionId: number;
  /** 사용자 미션 상태 */
  status: string;
}

export interface StoreMissionListItem {
  /** 미션 ID */
  missionId: number;
  /** 미션 내용 */
  content: string;
  /** 미션 완료 보상 포인트 */
  point: number;
  /** 미션 마감일 */
  deadline: string;
  /** 미션 생성일 */
  createdAt: string;
}

export interface StoreMissionListResponse {
  /** 특정 가게의 미션 목록 */
  missions: StoreMissionListItem[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 다음 조회에 사용할 cursor */
    cursor: number;
    /** 다음 페이지 존재 여부 */
    hasNext: boolean;
  };
}

export interface OngoingUserMissionListItem {
  /** 사용자 미션 ID */
  userMissionId: number;
  /** 미션 ID */
  missionId: number;
  /** 가게 ID */
  storeId: number;
  /** 가게 이름 */
  storeName: string;
  /** 미션 내용 */
  content: string;
  /** 미션 완료 보상 포인트 */
  point: number;
  /** 미션 마감일 */
  deadline: string;
  /** 사용자 미션 상태 */
  status: string;
  /** 미션 도전일 */
  challengedAt: string;
}

export interface OngoingUserMissionListResponse {
  /** 진행 중인 미션 목록 */
  missions: OngoingUserMissionListItem[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 다음 조회에 사용할 cursor */
    cursor: number;
    /** 다음 페이지 존재 여부 */
    hasNext: boolean;
  };
}

export interface CompletedUserMissionResponse {
  /** 사용자 미션 ID */
  userMissionId: number;
  /** 사용자 ID */
  userId: number;
  /** 완료한 미션 ID */
  missionId: number;
  /** 완료 후 사용자 미션 상태 */
  status: string;
  /** 미션 완료일 */
  completedAt: string;
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
): StoreMissionListResponse => {
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
): OngoingUserMissionListResponse => {
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

export const responseFromCompletedUserMission = (userMission: any): CompletedUserMissionResponse => {
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

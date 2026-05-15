import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { StatusCodes } from "http-status-codes";
import {
  challengeMission,
  completeUserMission,
  createMission,
  listOngoingUserMissions,
  listStoreMissions,
} from "../services/mission.service.js";
import type {
  MissionChallengeRequest,
  MissionChallengeResponse,
  MissionCreateRequest,
  MissionCreateResponse,
} from "../dtos/mission.dto.js";
import { AppError } from "../../../common/errors/app.error.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("stores/{storeId}/missions")
  @SuccessResponse(StatusCodes.CREATED, "미션 생성 성공")
  public async handleCreateMission(
    @Path() storeId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ApiResponse<{ message: string; data: MissionCreateResponse }>> {
    if (!body || !body.content || body.point === undefined || !body.deadline) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "MISSION400",
        message: "content, point, deadline은 필수입니다.",
      });
    }

    if (typeof body.point !== "number" || Number.isNaN(body.point)) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "MISSION400",
        message: "point는 숫자여야 합니다.",
      });
    }

    const deadlineDate = new Date(body.deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "MISSION400",
        message: "deadline은 올바른 날짜 형식이어야 합니다.",
      });
    }

    const result = await createMission(storeId, body);

    this.setStatus(StatusCodes.CREATED);
    return success({
      message: "미션 생성 성공",
      data: result,
    });
  }

  @Post("stores/{storeId}/missions/{missionId}/challenge")
  @SuccessResponse(StatusCodes.CREATED, "미션 도전 성공")
  public async handleChallengeMission(
    @Path() storeId: number,
    @Path() missionId: number,
    @Body() body: MissionChallengeRequest,
  ): Promise<ApiResponse<{ message: string; data: MissionChallengeResponse }>> {
    if (!body || body.userId === undefined) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "MISSION400",
        message: "userId는 필수입니다.",
      });
    }

    if (typeof body.userId !== "number" || Number.isNaN(body.userId)) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "MISSION400",
        message: "userId는 숫자여야 합니다.",
      });
    }

    const result = await challengeMission(storeId, missionId, body);

    this.setStatus(StatusCodes.CREATED);
    return success({
      message: "미션 도전 성공",
      data: result,
    });
  }

  @Get("stores/{storeId}/missions")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: unknown }>> {
    const result = await listStoreMissions(storeId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "특정 가게의 미션 목록 조회 성공",
      data: result,
    });
  }

  @Get("users/{userId}/missions/ongoing")
  public async handleListOngoingUserMissions(
    @Path() userId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: unknown }>> {
    const result = await listOngoingUserMissions(userId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "내가 진행 중인 미션 목록 조회 성공",
      data: result,
    });
  }

  @Patch("users/{userId}/missions/{missionId}/complete")
  public async handleCompleteUserMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<{ message: string; data: unknown }>> {
    const result = await completeUserMission(userId, missionId);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "진행 중인 미션을 완료했습니다.",
      data: result,
    });
  }
}

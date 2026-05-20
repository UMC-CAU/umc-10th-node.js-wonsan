import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Response,
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
  CompletedUserMissionResponse,
  OngoingUserMissionListResponse,
  StoreMissionListResponse,
} from "../dtos/mission.dto.js";
import { AppError } from "../../../common/errors/app.error.js";
import {
  ApiResponse,
  ErrorResponse,
  success,
} from "../../../common/responses/response.js";

@Route("")
@Tags("Missions")
export class MissionController extends Controller {
  /**
   * 특정 가게에 새로운 미션을 등록합니다.
   *
   * path parameter로 가게 ID를 받고, body로 미션 내용, 보상 포인트, 마감일을 전달합니다.
   */
  @Post("stores/{storeId}/missions")
  @SuccessResponse(StatusCodes.CREATED, "미션 생성 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "미션 생성 요청 값이 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "가게를 찾을 수 없습니다.")
  @Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, "미션 생성 처리 중 서버 오류가 발생했습니다.")
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

  /**
   * 사용자가 특정 가게의 미션에 도전합니다.
   *
   * path parameter로 가게 ID와 미션 ID를 받고, body로 사용자 ID를 전달합니다.
   */
  @Post("stores/{storeId}/missions/{missionId}/challenge")
  @SuccessResponse(StatusCodes.CREATED, "미션 도전 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "미션 도전 요청 값이 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "미션 또는 사용자를 찾을 수 없습니다.")
  @Response<ErrorResponse>(StatusCodes.CONFLICT, "이미 도전한 미션입니다.")
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

  /**
   * 특정 가게의 미션 목록을 cursor 기반으로 조회합니다.
   *
   * path parameter로 가게 ID를 받고, query parameter로 cursor를 전달할 수 있습니다.
   */
  @Get("stores/{storeId}/missions")
  @SuccessResponse(StatusCodes.OK, "특정 가게의 미션 목록 조회 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "가게 ID 또는 cursor가 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "가게를 찾을 수 없습니다.")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: StoreMissionListResponse }>> {
    const result = await listStoreMissions(storeId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "특정 가게의 미션 목록 조회 성공",
      data: result,
    });
  }

  /**
   * 특정 사용자가 진행 중인 미션 목록을 cursor 기반으로 조회합니다.
   *
   * path parameter로 사용자 ID를 받고, query parameter로 cursor를 전달할 수 있습니다.
   */
  @Get("users/{userId}/missions/ongoing")
  @SuccessResponse(StatusCodes.OK, "내가 진행 중인 미션 목록 조회 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "사용자 ID 또는 cursor가 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "사용자를 찾을 수 없습니다.")
  public async handleListOngoingUserMissions(
    @Path() userId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: OngoingUserMissionListResponse }>> {
    const result = await listOngoingUserMissions(userId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "내가 진행 중인 미션 목록 조회 성공",
      data: result,
    });
  }

  /**
   * 사용자가 도전 중인 미션을 완료 상태로 변경합니다.
   *
   * path parameter로 사용자 ID와 미션 ID를 전달합니다.
   */
  @Patch("users/{userId}/missions/{missionId}/complete")
  @SuccessResponse(StatusCodes.OK, "진행 중인 미션 완료 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "진행 중인 미션만 완료할 수 있습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "도전 중인 미션을 찾을 수 없습니다.")
  public async handleCompleteUserMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<{ message: string; data: CompletedUserMissionResponse }>> {
    const result = await completeUserMission(userId, missionId);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "진행 중인 미션을 완료했습니다.",
      data: result,
    });
  }
}

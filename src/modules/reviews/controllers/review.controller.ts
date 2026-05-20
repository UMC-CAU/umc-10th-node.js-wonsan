import {
  Body,
  Controller,
  Get,
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
  createReview,
  listMyReviews,
  listStoreReviews,
} from "../services/review.service.js";
import type {
  ReviewCreateRequest,
  ReviewCreateResponse,
  ReviewListResponse,
  MyReviewListResponse,
} from "../dtos/review.dto.js";
import { AppError } from "../../../common/errors/app.error.js";
import {
  ApiResponse,
  ErrorResponse,
  success,
} from "../../../common/responses/response.js";

@Route("")
@Tags("Reviews")
export class ReviewController extends Controller {
  /**
   * 특정 가게에 리뷰를 작성합니다.
   *
   * path parameter로 가게 ID를 받고, body로 사용자 ID, 별점, 리뷰 내용을 전달합니다.
   */
  @Post("stores/{storeId}/reviews")
  @SuccessResponse(StatusCodes.CREATED, "리뷰 작성 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "리뷰 작성 요청 값이 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "가게 또는 사용자를 찾을 수 없습니다.")
  @Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, "리뷰 작성 처리 중 서버 오류가 발생했습니다.")
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest,
  ): Promise<ApiResponse<{ message: string; data: ReviewCreateResponse }>> {
    if (
      !body ||
      body.userId === undefined ||
      body.rating === undefined ||
      !body.content
    ) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "REVIEW400",
        message: "userId, rating, content는 필수입니다.",
      });
    }

    if (typeof body.rating !== "number" || Number.isNaN(body.rating)) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "REVIEW400",
        message: "rating은 숫자여야 합니다.",
      });
    }

    if (body.rating < 0 || body.rating > 5) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "REVIEW400",
        message: "rating은 0 이상 5 이하이어야 합니다.",
      });
    }

    const result = await createReview(storeId, body);

    this.setStatus(StatusCodes.CREATED);
    return success({
      message: "리뷰 작성 성공",
      data: result,
    });
  }

  /**
   * 특정 가게에 작성된 리뷰 목록을 조회합니다.
   *
   * path parameter로 가게 ID를 전달합니다.
   */
  @Get("stores/{storeId}/reviews")
  @SuccessResponse(StatusCodes.OK, "리뷰 목록 조회 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "가게 ID가 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "가게를 찾을 수 없습니다.")
  public async handleListStoreReviews(
    @Path() storeId: number,
  ): Promise<ApiResponse<{ message: string; data: ReviewListResponse }>> {
    const result = await listStoreReviews(storeId);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "리뷰 목록 조회 성공",
      data: result,
    });
  }

  /**
   * 특정 사용자가 작성한 리뷰 목록을 cursor 기반으로 조회합니다.
   *
   * path parameter로 사용자 ID를 받고, query parameter로 cursor를 전달할 수 있습니다.
   */
  @Get("users/{userId}/reviews")
  @SuccessResponse(StatusCodes.OK, "내가 작성한 리뷰 목록 조회 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "사용자 ID 또는 cursor가 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "사용자를 찾을 수 없습니다.")
  public async handleListMyReviews(
    @Path() userId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: MyReviewListResponse }>> {
    const result = await listMyReviews(userId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "내가 작성한 리뷰 목록 조회 성공",
      data: result,
    });
  }
}

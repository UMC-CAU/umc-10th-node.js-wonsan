import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
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
} from "../dtos/review.dto.js";
import { AppError } from "../../../common/errors/app.error.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("")
@Tags("Reviews")
export class ReviewController extends Controller {
  @Post("stores/{storeId}/reviews")
  @SuccessResponse(StatusCodes.CREATED, "리뷰 작성 성공")
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

  @Get("stores/{storeId}/reviews")
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

  @Get("users/{userId}/reviews")
  public async handleListMyReviews(
    @Path() userId: number,
    @Query() cursor = 0,
  ): Promise<ApiResponse<{ message: string; data: unknown }>> {
    const result = await listMyReviews(userId, cursor);

    this.setStatus(StatusCodes.OK);
    return success({
      message: "내가 작성한 리뷰 목록 조회 성공",
      data: result,
    });
  }
}

import {
  Body,
  Controller,
  Path,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { StatusCodes } from "http-status-codes";
import { createStore } from "../services/store.service.js";
import type {
  StoreCreateRequest,
  StoreCreateResponse,
} from "../dtos/store.dto.js";
import { AppError } from "../../../common/errors/app.error.js";
import {
  ApiResponse,
  ErrorResponse,
  success,
} from "../../../common/responses/response.js";

@Route("regions/{regionId}/stores")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 특정 지역에 새로운 가게를 등록합니다.
   *
   * path parameter로 지역 ID를 받고, body로 가게 이름과 주소를 전달합니다.
   */
  @Post()
  @SuccessResponse(StatusCodes.CREATED, "가게 생성 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "가게 생성 요청 값이 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "지역을 찾을 수 없습니다.")
  @Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, "가게 생성 처리 중 서버 오류가 발생했습니다.")
  public async handleCreateStore(
    @Path() regionId: number,
    @Body() body: StoreCreateRequest,
  ): Promise<ApiResponse<{ message: string; data: StoreCreateResponse }>> {
    if (!body.name || !body.address) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "STORE400",
        message: "가게 이름과 주소는 필수입니다.",
      });
    }

    const result = await createStore(regionId, body);

    this.setStatus(StatusCodes.CREATED);
    return success({
      message: "가게 생성 성공",
      data: result,
    });
  }
}

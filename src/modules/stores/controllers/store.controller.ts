import {
  Body,
  Controller,
  Path,
  Post,
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
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("regions/{regionId}/stores")
@Tags("Stores")
export class StoreController extends Controller {
  @Post()
  @SuccessResponse(StatusCodes.CREATED, "가게 생성 성공")
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

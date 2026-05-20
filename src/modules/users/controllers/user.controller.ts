import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Request,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { StatusCodes } from "http-status-codes";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { AppError } from "../../../common/errors/app.error.js";
import { Request as ExpressRequest } from "express";
import {
  ApiResponse,
  ErrorResponse,
  success,
} from "../../../common/responses/response.js";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  /**
   * 사용자 회원가입을 진행합니다.
   *
   * 이메일, 이름, 성별, 생년월일, 전화번호, 선호 카테고리 ID 목록을 body로 전달합니다.
   */
  @Post("signup")
  @SuccessResponse(StatusCodes.OK, "회원가입 성공")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "회원가입 요청 값이 올바르지 않습니다.")
  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, "선호 카테고리를 찾을 수 없습니다.")
  @Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, "회원가입 처리 중 서버 오류가 발생했습니다.")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);

    if (
      !body ||
      !body.email ||
      !body.name ||
      !body.gender ||
      !body.birth ||
      !body.phoneNumber ||
      !Array.isArray(body.preferences)
    ) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "USER400",
        message: "email, name, gender, birth, phoneNumber, preferences는 필수입니다.",
      });
    }

    if (Number.isNaN(new Date(body.birth).getTime())) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: "USER400",
        message: "birth는 올바른 날짜 형식이어야 합니다. 예: 2000-01-01",
      });
    }

    const user = await userSignUp(body);

    this.setStatus(StatusCodes.OK);
    return success(user); //성공 응답 보내기
  }

  /**
   * 로그인 없이 접근 가능한 게스트 페이지를 반환합니다.
   */
  @Get("guest")
  @SuccessResponse(StatusCodes.OK, "게스트 페이지 조회 성공")
  public async handleGuestPage(): Promise<string> {
    return `
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
        <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
      </ul>
    `;
  }

  /**
   * 로그인 안내 페이지를 반환합니다.
   */
  @Get("login")
  @SuccessResponse(StatusCodes.OK, "로그인 페이지 조회 성공")
  public async handleLoginPage(): Promise<string> {
    return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
  }

  /**
   * 로그인 쿠키가 있는 사용자만 접근할 수 있는 마이페이지를 반환합니다.
   */
  @Get("mypage")
  @Middlewares(authorizeUser())
  @SuccessResponse(StatusCodes.OK, "마이페이지 조회 성공")
  @Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.")
  public async handleMypage(
    @Request() req: ExpressRequest,
  ): Promise<string> {
    return `
      <h1>마이페이지</h1>
      <p>환영합니다, ${req.cookies.username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `;
  }

  /**
   * 실습용 로그인 쿠키를 생성합니다.
   */
  @Get("set-login")
  @SuccessResponse(StatusCodes.OK, "로그인 쿠키 생성 성공")
  public async handleSetLogin(
    @Request() req: ExpressRequest,
  ): Promise<string> {
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });

    return '로그인 쿠키(username=UMC10th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>';
  }

  /**
   * 실습용 로그인 쿠키를 삭제합니다.
   */
  @Get("set-logout")
  @SuccessResponse(StatusCodes.OK, "로그아웃 성공")
  public async handleSetLogout(
    @Request() req: ExpressRequest,
  ): Promise<string> {
    req.res!.clearCookie("username");

    return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
  }
}

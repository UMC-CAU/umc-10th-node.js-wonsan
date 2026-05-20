// 1. 회원가입 요청 데이터의 설계도를 만듭니다.
export interface UserSignUpRequest {
  /** 사용자 이메일 */
  email: string;
  /** 사용자 이름 */
  name: string;
  /** 사용자 성별 */
  gender: string;
  /** 생년월일 */
  birth: string;
  /** 기본 주소 */
  address?: string;       // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻이에요!
  /** 상세 주소 */
  detailAddress?: string;
  /** 전화번호 */
  phoneNumber: string;
  /** 선호 음식 카테고리 ID 목록 */
  preferences: number[];
}


// user.converter.ts

export interface UserSignUpResponse {
  /** 가입된 사용자 이메일 */
  email: string;
  /** 가입된 사용자 이름 */
  name: string;
  /** 사용자가 선택한 선호 카테고리 이름 목록 */
  preferCategory: string[];
}

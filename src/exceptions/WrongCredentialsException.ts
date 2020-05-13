import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "이메일 혹은 비밀번호를 다시 확인해주세요.");
  }
}

export default WrongCredentialsException;

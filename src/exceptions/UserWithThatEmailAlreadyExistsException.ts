import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `이미 존재하는 이메일입니다: ${email}`);
  }
}

export default UserWithThatEmailAlreadyExistsException;

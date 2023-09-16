import HttpException from "./HttpException";

export default class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(404, `User with email ${email} already exists`);
  }
}


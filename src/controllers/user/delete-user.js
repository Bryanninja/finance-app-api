import { UserNotFoundError } from '../../errors/users.js';
import {
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  userNotFoundResponse,
  notFound,
} from '../helpers/index.js';

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) return invalidIdResponse();

      const deletedUser = await this.deleteUserUseCase.execute(userId);

      if (!deletedUser) return userNotFoundResponse();

      return ok(deletedUser);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}

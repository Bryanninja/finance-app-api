import { ZodError } from 'zod';
import { EmailAlredyInUseError } from '../../errors/users.js';
import { updateUserSchema } from '../../schemas/user.js';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  badRequest,
  ok,
  serverError,
} from '../helpers/index.js';

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) return invalidIdResponse();

      const params = httpRequest.body;

      await updateUserSchema.parseAsync(params);

      const updatedUser = await this.updateUserUseCase.execute(userId, params);
      return ok(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }
      if (error instanceof EmailAlredyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}

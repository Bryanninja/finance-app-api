import { EmailAlredyInUseError } from '../../errors/users.js';
import { createUserSchema } from '../../schemas/user.js';
import { badRequest, serverError, created } from '../helpers/index.js';

import { ZodError } from 'zod';

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      await createUserSchema.parseAsync(params);

      // chamar o use case
      const createdUser = await this.createUserUseCase.execute(params);

      //retornar a resposta para o usúario (status code)
      return created(createdUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.issues[0].message,
        });
      }

      if (error instanceof EmailAlredyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}

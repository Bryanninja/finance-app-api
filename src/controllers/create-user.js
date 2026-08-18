import { CreateUserUseCase } from '../use-cases/create-user.js';
import validator from 'validator';
import { badRequest, serverError, created } from './helpers.js';

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      //validar a requisição (Campos obrigatórios, tamanho de senha e e-mail)
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` });
        }
      }

      //tamanho de senha
      const passwordIsValid = params.password.length > 6;
      if (!passwordIsValid) {
        return badRequest({
          message: 'Password must be at least 6 characters',
        });
      }

      const emailIsValid = validator.isEmail(params.email);

      if (!emailIsValid) {
        return badRequest({
          message: 'Invalid E-mail. Please provide a valid one.',
        });
      }

      // chamar o use case
      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      //retornar a resposta para o usúario (status code)
      return created(createdUser);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}

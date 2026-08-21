import { CreateUserUseCase } from '../use-cases/create-user.js';
import { badRequest, serverError, created } from './helpers/http.js';
import { EmailAlredyInUseError } from '../errors/users.js';
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
} from './helpers/user.js';

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
      const passwordIsValid = checkIfPasswordIsValid(params.password);
      if (!passwordIsValid) {
        return invalidPasswordResponse();
      }

      const emailIsValid = checkIfEmailIsValid(params.email);

      if (!emailIsValid) {
        return emailIsAlreadyInUseResponse();
      }

      // chamar o use case
      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      //retornar a resposta para o usúario (status code)
      return created(createdUser);
    } catch (error) {
      if (error instanceof EmailAlredyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}

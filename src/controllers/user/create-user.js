import { EmailAlredyInUseError } from '../../errors/users.js';
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
  badRequest,
  serverError,
  created,
  validateRequiredFields,
} from '../helpers/index.js';

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      //validar a requisição (Campos obrigatórios, tamanho de senha e e-mail)
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];

      const { ok: requiredFieldWereProvided, missingField } =
        validateRequiredFields(params, requiredFields);

      if (!requiredFieldWereProvided)
        return badRequest({
          message: `The field ${missingField} is required.`,
        });

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
      const createdUser = await this.createUserUseCase.execute(params);

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

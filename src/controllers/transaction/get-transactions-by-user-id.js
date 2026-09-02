import { UserNotFoundError } from '../../errors/users';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  requiredFieldsIsMissingResponse,
  serverError,
  userNotFoundResponse,
} from '../helpers';

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
  }

  async execute(httpRequest) {
    try {
      //verificar se o userId foi passado como params
      const userId = httpRequest.query.userId;

      if (!userId) {
        return requiredFieldsIsMissingResponse('userId');
      }

      //verificar se o userId é um Id válido
      const userIdIsValid = checkIfIdIsValid(userId);

      if (!userIdIsValid) {
        return invalidIdResponse();
      }

      //chamar use case
      const transactions = await this.getTransactionsByUserIdUseCase.execute({
        userId,
      });

      //retornar resposta http
      return ok(transactions);
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}

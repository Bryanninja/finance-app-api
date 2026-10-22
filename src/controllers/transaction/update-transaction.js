import z from 'zod';
import { updateTransactionSchema } from '../../schemas/transaction.js';
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from '../helpers/index.js';

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      //validar se o id transaction é valido
      const transactionId = httpRequest.params.transactionId;
      const idIsValid = checkIfIdIsValid(transactionId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      await updateTransactionSchema.parseAsync(params);

      const transaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      );

      return ok(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return badRequest({ message: error.issues[0].message });
      }
      console.error(error);
      return serverError();
    }
  }
}

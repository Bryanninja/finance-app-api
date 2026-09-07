import { TransactionNotFoundError } from '../../errors/transactions.js';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  ok,
  serverError,
} from '../helpers';

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const transactionIdIsValid = checkIfIdIsValid(transactionId);

      if (!transactionIdIsValid) {
        return invalidIdResponse();
      }

      const deletedTransaction =
        await this.deleteTransactionUseCase.execute(transactionId);

      return ok(deletedTransaction);
    } catch (error) {
      console.error(error);
      if (error instanceof TransactionNotFoundError) {
        return notFound({ message: error.message });
      }
      return serverError();
    }
  }
}

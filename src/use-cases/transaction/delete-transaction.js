import { TransactionNotFoundError } from '../../errors/transactions.js';

export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository, getTransactionByIdRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }
  async execute(transactionId) {
    const transactionIdIsValid =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (!transactionIdIsValid) {
      throw new TransactionNotFoundError();
    }

    const deletedTransaction =
      await this.deleteTransactionRepository.execute(transactionId);

    return deletedTransaction;
  }
}

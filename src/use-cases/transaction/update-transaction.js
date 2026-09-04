import { UserNotFoundError } from '../../errors/users.js';

export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getUserByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params) {
    const userId = params.userId;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transaction = await this.updateTransactionRepository.execute(params);

    return transaction;
  }
}

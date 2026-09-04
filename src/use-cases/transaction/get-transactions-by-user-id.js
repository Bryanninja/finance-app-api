import { UserNotFoundError } from '../../errors/users.js';

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(params) {
    //validar se o usuário existe
    const userId = params.userId;
    const validUser = await this.getUserByIdRepository.execute(userId);

    if (!validUser) {
      throw new UserNotFoundError(userId);
    }

    //chamar repository
    const transactions =
      await this.getTransactionsByUserIdRepository.execute(userId);

    return transactions;
  }
}

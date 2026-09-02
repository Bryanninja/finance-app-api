import { UserNotFoundError } from '../../errors/users';

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByIdRepository, getUserByIdRepository) {
    this.getTransactionsByIdRepository = getTransactionsByIdRepository;
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
      await this.getTransactionsByIdRepository.execute(userId);

    return transactions;
  }
}

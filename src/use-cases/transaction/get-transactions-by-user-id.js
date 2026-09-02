import { userNotFoundResponse } from '../../controllers/helpers/index.js';

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
      return userNotFoundResponse();
    }

    //chamar repository
    const transactions =
      await this.getTransactionsByIdRepository.execute(userId);

    return transactions;
  }
}

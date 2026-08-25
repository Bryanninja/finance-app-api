import { UserNotFoundError } from '../../errors/users';
import { v4 as uuidV4 } from 'uuid';

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserByIdRepository) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(createTransactionsParams) {
    //validar se o usúario existe
    const userId = createTransactionsParams.userId;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = uuidV4();

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionsParams,
      id: transactionId,
    });

    return transaction;
  }
}

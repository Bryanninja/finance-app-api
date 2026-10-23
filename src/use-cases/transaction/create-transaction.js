import { UserNotFoundError } from '../../errors/users.js';

export class CreateTransactionUseCase {
  constructor(
    createTransactionRepository,
    getUserByIdRepository,
    idGeneratorAdapter,
  ) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createTransactionsParams) {
    //validar se o usúario existe
    const userId = createTransactionsParams.user_id;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = this.idGeneratorAdapter.execute();

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionsParams,
      id: transactionId,
    });

    return transaction;
  }
}

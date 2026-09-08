import { UserNotFoundError } from '../../errors/users.js';

export class GetUserBalanceUseCase {
  constructor(getUserBalanceRepository, getUserByIdRepository) {
    this.getUserBalanceRepository = getUserBalanceRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params) {
    const { userId } = params;

    const userIsValid = await this.getUserByIdRepository.execute(userId);
    if (!userIsValid) {
      throw new UserNotFoundError();
    }

    const balance = await this.getUserBalanceRepository.execute(userId);

    return balance;
  }
}

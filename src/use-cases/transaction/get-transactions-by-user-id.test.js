import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/users';

describe('GetTransactionsByUserIdUseCase', () => {
  const getTransactionParams = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EXPENSE',
  };

  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  class GetTransactionsByUserIdRepositoryStub {
    async execute(userId) {
      return { ...getTransactionParams, user_id: userId };
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId };
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdRepository =
      new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionsByUserIdRepository,
      getUserByIdRepository,
    );

    return {
      getTransactionsByUserIdRepository,
      getUserByIdRepository,
      sut,
    };
  };

  it('should successfully get transactions by user id', async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();

    const transactions = await sut.execute(userId);

    expect(transactions).toEqual({
      ...getTransactionParams,
      user_id: userId,
    });
  });

  it('should call GetTransactionsByUserIdRepository with correct user id', async () => {
    const { sut, getTransactionsByUserIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getTransactionsByUserIdRepository, 'execute');
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should call GetUserByIdRepository with correct user id', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);
    const userId = faker.string.uuid();

    const promise = sut.execute(userId);
    expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });
});

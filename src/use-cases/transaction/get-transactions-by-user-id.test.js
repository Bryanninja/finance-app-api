import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/users';
import { transaction, user } from '../../tests';

describe('GetTransactionsByUserIdUseCase', () => {
  class GetTransactionsByUserIdRepositoryStub {
    async execute(userId) {
      return [{ ...transaction, user_id: userId }];
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
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

    expect(transactions).toEqual([
      {
        ...transaction,
        user_id: userId,
      },
    ]);
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
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should throw if GetTransactionsByUserIdRepository throws', async () => {
    const { sut, getTransactionsByUserIdRepository } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const userId = faker.string.uuid();

    const promise = sut.execute(userId);
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const userId = faker.string.uuid();

    const promise = sut.execute(userId);
    await expect(promise).rejects.toThrow();
  });
});

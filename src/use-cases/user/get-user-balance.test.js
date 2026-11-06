import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';
import { UserNotFoundError } from '../../errors/users';
import { userBalance, user } from '../../tests';

describe('GetUserBalanceUseCase', () => {
  const userId = faker.string.uuid();

  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return {
      getUserBalanceRepository,
      getUserByIdRepository,
      sut,
    };
  };

  it('Should return user balance successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual(userBalance);
  });

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should call GetUserByIdRepository with correct id', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should call GetUserBalanceRepository with correct id', async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute');

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error());

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserBalanceRepository throws', async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error());

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });
});

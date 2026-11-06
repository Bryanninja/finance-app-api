import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';
import { user } from '../../tests';

describe('GetUserByIdUseCase', () => {
  const userId = faker.string.uuid();

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return {
      getUserByIdRepository,
      sut,
    };
  };

  it('should return a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual(user);
  });

  it('should call GetUserByIdRepository with correct id', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });
});

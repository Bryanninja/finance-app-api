import { jest } from '@jest/globals';
import { CreateTransactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/users';
import { transaction, user } from '../../tests';

describe('CreateTransactionUseCase', () => {
  const createTransactionParams = {
    ...transaction,
    id: undefined,
  };

  class CreateTransactionRepositoryStub {
    async execute(transaction) {
      return transaction;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId };
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'random-generated-id';
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
      sut,
    };
  };

  it('should create transaction successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(createTransactionParams);

    expect(result).toEqual({
      ...createTransactionParams,
      id: 'random-generated-id',
    });
  });

  it('should call GetUserByIdRepository with correct user_id', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute');

    await sut.execute(createTransactionParams);

    expect(getUserByIdSpy).toHaveBeenCalledWith(
      createTransactionParams.user_id,
    );
  });

  it('should call IdGeneratorAdapter to generate a transaction id', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');

    await sut.execute(createTransactionParams);

    expect(idGeneratorSpy).toHaveBeenCalled();
  });

  it('should call CreateTransactionRepository with correct params', async () => {
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionRepositorySpy = jest.spyOn(
      createTransactionRepository,
      'execute',
    );

    await sut.execute(createTransactionParams);

    expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'random-generated-id',
    });
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);

    const promise = sut.execute(createTransactionParams);

    await expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    );
  });

  it('should throw an error when CreateTransactionRepository throws an error', async () => {
    const { sut, createTransactionRepository } = makeSut();
    jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(createTransactionParams);

    await expect(promise).rejects.toThrow(new Error());
  });

  it('should throw an error when GetUserByIdRepository throws an error', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(createTransactionParams);

    await expect(promise).rejects.toThrow(new Error());
  });

  it('should throw an error when IdGeneratorAdapter throws an error', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(createTransactionParams);

    await expect(promise).rejects.toThrow(new Error());
  });
});

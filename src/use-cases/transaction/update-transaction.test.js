import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from './update-transaction';

describe('UpdateTransactionUseCase', () => {
  const updateTransactionParams = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EXPENSE',
  };

  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...updateTransactionParams, id: transactionId };
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionUseCase(updateTransactionRepository);

    return {
      updateTransactionRepository,
      sut,
    };
  };

  it('should update a transaction successfully', async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    const result = await sut.execute(transactionId);

    expect(result).toEqual({ ...updateTransactionParams, id: transactionId });
  });

  it('should call UpdateTransactionRepository with correct params', async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      'execute',
    );

    const transactionId = faker.string.uuid();
    await sut.execute(transactionId, { amout: updateTransactionParams.amount });

    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transactionId, {
      amout: updateTransactionParams.amount,
    });
  });

  it('should throw an error if UpdateTransactionRepository throws', async () => {
    const { sut, updateTransactionRepository } = makeSut();
    jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error('Repository error'));

    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId, {
      amout: updateTransactionParams.amount,
    });
    await expect(promise).rejects.toThrow(new Error('Repository error'));
  });
});

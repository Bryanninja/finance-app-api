import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from './update-transaction';
import { transaction } from '../../tests';

describe('UpdateTransactionUseCase', () => {
  class UpdateTransactionRepositoryStub {
    async execute() {
      return transaction;
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

    expect(result).toEqual(transaction);
  });

  it('should call UpdateTransactionRepository with correct params', async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      'execute',
    );

    const transactionId = faker.string.uuid();
    await sut.execute(transactionId, { amout: transaction.amount });

    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transactionId, {
      amout: transaction.amount,
    });
  });

  it('should throw an error if UpdateTransactionRepository throws', async () => {
    const { sut, updateTransactionRepository } = makeSut();
    jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error('Repository error'));

    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId, {
      amout: transaction.amount,
    });
    await expect(promise).rejects.toThrow(new Error('Repository error'));
  });
});

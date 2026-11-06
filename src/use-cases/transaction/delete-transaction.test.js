import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';
import { TransactionNotFoundError } from '../../errors/transactions';
import { transaction } from '../../tests';

describe('DeleteTransactionUseCase', () => {
  class DeleteTransactionRepositoryStub {
    async execute() {
      return transaction;
    }
  }

  class GetTransactionByIdRepositoryStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const getTransactionByIdRepository = new GetTransactionByIdRepositoryStub();
    const sut = new DeleteTransactionUseCase(
      deleteTransactionRepository,
      getTransactionByIdRepository,
    );

    return {
      deleteTransactionRepository,
      getTransactionByIdRepository,
      sut,
    };
  };

  it('should delete a transaction successfully', async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    const result = await sut.execute(transactionId);

    expect(result).toEqual(transaction);
  });

  it('should throw an error if the transaction does not exist', async () => {
    const { sut, getTransactionByIdRepository } = makeSut();
    jest
      .spyOn(getTransactionByIdRepository, 'execute')
      .mockResolvedValueOnce(null);
    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId);
    await expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transactionId),
    );
  });

  it('should call GetTransactionByIdRepository with correct transactionId', async () => {
    const { sut, getTransactionByIdRepository } = makeSut();
    const getTransactionByIdSpy = jest.spyOn(
      getTransactionByIdRepository,
      'execute',
    );
    const transactionId = faker.string.uuid();

    await sut.execute(transactionId);

    expect(getTransactionByIdSpy).toHaveBeenCalledWith(transactionId);
  });

  it('should call DeleteTransactionRepository with correct transactionId', async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const deleteTransactionSpy = jest.spyOn(
      deleteTransactionRepository,
      'execute',
    );
    const transactionId = faker.string.uuid();

    await sut.execute(transactionId);

    expect(deleteTransactionSpy).toHaveBeenCalledWith(transactionId);
  });

  it('should throw an error when DeleteTransactionRepository throws an error', async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error('DeleteTransactionRepository error'));
    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId);

    await expect(promise).rejects.toThrow(
      new Error('DeleteTransactionRepository error'),
    );
  });

  it('should throw an error when GetTransactionByIdRepository throws an error', async () => {
    const { sut, getTransactionByIdRepository } = makeSut();
    jest
      .spyOn(getTransactionByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error('GetTransactionByIdRepository error'));
    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId);

    await expect(promise).rejects.toThrow(
      new Error('GetTransactionByIdRepository error'),
    );
  });

  it;
});

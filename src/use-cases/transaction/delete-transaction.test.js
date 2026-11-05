import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';
import { TransactionNotFoundError } from '../../errors/transactions';

describe('DeleteTransactionUseCase', () => {
  const deleteTransactionParams = {
    user_id: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EXPENSE',
  };

  class DeleteTransactionRepositoryStub {
    async execute() {
      return deleteTransactionParams;
    }
  }

  class GetTransactionByIdRepositoryStub {
    async execute() {
      return deleteTransactionParams;
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

    expect(result).toEqual(deleteTransactionParams);
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
});

import { jest } from '@jest/globals';
import { TransactionNotFoundError } from '../../errors/transactions';
import { DeleteTransactionController } from './delete-transaction';
import { faker } from '@faker-js/faker';

describe('DeleteTransaction', () => {
  class DeleteTransactionUseCaseStub {
    execute() {
      return {
        name: faker.string.alphanumeric(10),
        user_id: faker.string.uuid(),
        date: faker.date.anytime(),
        amount: Number(faker.finance.amount()),
        type: 'INVESTMENT',
      };
    }
  }

  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return {
      deleteTransactionUseCase,
      sut,
    };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
  };

  it('should return 200 when a transaction is deleted', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it('should return 400 when transaction id provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: { transactionId: 'invalid_id' },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 404 when a transaction is not found', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new TransactionNotFoundError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it('should return 500 when DeleteTransactionUseCase throws an error ', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it('should call DeleteTransactionUseCase with correct transaction id', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute');

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.transactionId);
  });
});

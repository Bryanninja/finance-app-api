import { DeleteTransactionController } from './delete-transaction';
import { faker } from '@faker-js/faker';

describe('DeleteTransaction', () => {
  class DeleteTransactionUseCaseStub {
    execute(transaction) {
      return transaction;
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

  it('should return 200 when a transaction is deleted', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });

    expect(result.statusCode).toBe(200);
  });

  it('should return 400 when transaction id provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: { transactionId: 'invalid_id' },
    });

    expect(result.statusCode).toBe(400);
  });
});

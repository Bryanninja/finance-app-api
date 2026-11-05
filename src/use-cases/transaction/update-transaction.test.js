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
});

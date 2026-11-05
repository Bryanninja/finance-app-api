import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';

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
});

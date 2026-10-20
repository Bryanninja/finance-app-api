import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { faker } from '@faker-js/faker';

describe('GetTransactionsByUserIdController', () => {
  class GetTransactionsByUserIdUseCaseStub {
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
    const getTransactionsByUserIdUseCaseStub =
      new GetTransactionsByUserIdUseCaseStub();
    const sut = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCaseStub,
    );

    return {
      getTransactionsByUserIdUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    query: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 when return a transaction', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });
});

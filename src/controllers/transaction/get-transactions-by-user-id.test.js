import { jest } from '@jest/globals';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../errors/users';

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
    const getTransactionsByUserIdUseCase =
      new GetTransactionsByUserIdUseCaseStub();
    const sut = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase,
    );

    return {
      getTransactionsByUserIdUseCase,
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

  it('should return 400 when the userId provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({ query: { userId: 'invalid_id' } });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing userId param', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({ query: { userId: undefined } });

    expect(result.statusCode).toBe(400);
  });

  it('should return 404 when GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
    const { sut, getTransactionsByUserIdUseCase } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.query.userId));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });
});

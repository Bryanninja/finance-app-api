import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from './update-transaction';

describe('UpdateTransactionController', () => {
  class UpdateTransactionUseCaseStub {
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
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return { sut, updateTransactionUseCase };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.string.alphanumeric(10),
      date: faker.date.anytime(),
      amount: Number(faker.finance.amount()),
      type: 'INVESTMENT',
    },
  };

  it('should return 200 when updating a transaction sucessfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it('should return 400 when transactionId is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: { transactionId: 'invalid_id' },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when unallowed field is provied', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        unallowed_field: 'some_value',
      },
    });

    expect(result.statusCode).toBe(400);
  });
});

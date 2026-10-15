import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction';

describe('CreateTransactionController', () => {
  class CreateTransactionUseCaseStub {
    execute(transaction) {
      return transaction;
    }
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);

    return {
      createTransactionUseCase,
      sut,
    };
  };

  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.string.alphanumeric(10),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: 'INVESTMENT',
    },
  };

  it('should return 201 when create a transaction', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
  });

  it('should return 400 when a user_id is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        user_id: 'invalid_id',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when a user_id provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        user_id: 'invalid_id',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing name', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        name: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing date', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing type', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing amount', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when date is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: 'invalid_date',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when date is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: 'invalid_type',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when amount is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: 'invalid_amount',
      },
    });

    expect(result.statusCode).toBe(400);
  });
});

import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';

describe('GetUserBalanceUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  const userBalance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  };

  const userId = faker.string.uuid();

  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return {
      getUserBalanceRepository,
      getUserByIdRepository,
      sut,
    };
  };

  it('Should return user balance successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual(userBalance);
  });
});

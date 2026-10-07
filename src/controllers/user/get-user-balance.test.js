import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
  class GetUserBalanceUseCaseStub {
    async execute() {
      return {
        balance: {
          earnings: 25000,
          expenses: 2400,
          investments: 5000,
          balance: 17600,
        },
      };
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return {
      getUserBalanceUseCase,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 on when getting user balance', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });
});

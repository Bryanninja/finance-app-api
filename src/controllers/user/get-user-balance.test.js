import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';
import { UserNotFoundError } from '../../errors/users';

describe('GetUserBalanceController', () => {
  class GetUserBalanceUseCaseStub {
    execute() {
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

  it('should return 400 when userId is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({ params: { userId: 'Invalid_id' } });

    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it('should return 404 if user is not found (use case returns null)', async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    jest.spyOn(getUserBalanceUseCase, 'execute').mockResolvedValueOnce(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if GetUserBalanceUseCase throws', async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserBalanceUseCase with correct params', async () => {
    const { sut, getUserBalanceUseCase } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute');

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});

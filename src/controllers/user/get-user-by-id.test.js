import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';
import { UserNotFoundError } from '../../errors/users';

describe('GetUserByIdController', () => {
  class GetUserByIdUseCaseStub {
    execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      };
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return {
      getUserByIdUseCase,
      sut,
    };
  };

  it('should return 200 if a user is found', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id provided is not valid', async () => {
    const { sut } = makeSut();
    const result = await sut.execute({ params: { userId: 'Invalid_Id' } });
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if a user is not found', async () => {
    const { sut, getUserByIdUseCase } = makeSut();
    jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(faker.string.uuid()));

    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    expect(result.statusCode).toBe(404);
  });
});

import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';

describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCase);

    return {
      updateUserUseCase,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  };

  it('should return 200 if user has been updated', async () => {
    const { sut } = makeSut();
    const result = await sut.execute(httpRequest);
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id provided is invalid', async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
      httpRequest,
    });

    expect(result.statusCode).toBe(400);
  });
});

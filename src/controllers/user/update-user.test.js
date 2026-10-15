import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';
import { EmailAlredyInUseError } from '../../errors/users';

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

  it('should return 400 if email provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: 'invalid_email',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password provided is invalid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 5 }),
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 500 if UpdateUserUseCase throws an error', async () => {
    const { sut, updateUserUseCase } = makeSut();
    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it('should return 400 if UpdateUserUseCase throws EmailAlredyInUseError', async () => {
    const { sut, updateUserUseCase } = makeSut();
    jest
      .spyOn(updateUserUseCase, 'execute')
      .mockRejectedValueOnce(new EmailAlredyInUseError(httpRequest.body.email));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});

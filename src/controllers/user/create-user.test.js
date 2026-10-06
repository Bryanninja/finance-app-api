import { jest } from '@jest/globals';
import { CreateUserController } from './create-user';
import { faker } from '@faker-js/faker';
import { EmailAlredyInUseError } from '../../errors/users';

describe('create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const sut = new CreateUserController(createUserUseCase);

    return {
      createUserUseCase,
      sut,
    };
  };

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  };

  it('should return 201 when creating an user successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it('should return 400 if first_name is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        first_name: undefined,
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if last_name is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        last_name: undefined,
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        email: undefined,
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        email: 'invalid_email',
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        password: undefined,
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is less than 6 characters ', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        password: faker.internet.password({ length: 5 }),
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should call CreateUserUseCase with correct params', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    const executeSpy = jest.spyOn(createUserUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if CreateUserUseCase throw', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should return 500 if CreateUserUseCase throws EmailsIsAlredyInUseError', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new EmailAlredyInUseError(httpRequest.body.email);
    });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });
});

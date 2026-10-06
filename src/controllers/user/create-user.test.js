import { CreateUserController } from './create-user';

describe('create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  it('should return 201 when creating an user successfully', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        email: 'de@gmail.com',
        password: '1234567',
      },
    };

    //act

    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it('should return 400 if first_name is not provided', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        last_name: 'Nascimento',
        email: 'de@gmail.com',
        password: '1234567',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if last_name is not provided', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        email: 'de@gmail.com',
        password: '1234567',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not provided', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        password: '1234567',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        email: 'de',
        password: '1234567',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        email: 'de@gmail.com',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is less than 6 characters ', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        email: 'de@gmail.com',
        password: '123',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should call CreateUserUseCase with correct params', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Bryan',
        last_name: 'Nascimento',
        email: 'de@gmail.com',
        password: '1234567',
      },
    };

    const executeSpy = jest.spyOn(createUserUseCase, 'execute');

    //act
    await createUserController.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});

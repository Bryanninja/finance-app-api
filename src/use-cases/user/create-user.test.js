import { CreateUserUseCase } from './create-user.js';
import { faker } from '@faker-js/faker';

describe('CreateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute(user) {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'hashed_password';
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return 'generated_id';
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    );

    return {
      sut,
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    };
  };

  const createUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };

  it('should successfully create a user', async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute(createUserParams);

    expect(createdUser).toBeTruthy();
  });
});

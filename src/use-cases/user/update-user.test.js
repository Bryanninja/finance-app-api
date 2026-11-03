import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';

describe('UpdateUserUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'password_hasher';
    }
  }

  class UpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const sut = new UpdateUserUseCase(
      updateUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
    );

    return {
      updateUserRepository,
      passwordHasherAdapter,
      getUserByEmailRepository,
      sut,
    };
  };

  it('should return a user updated successfully (without email and password)', async () => {
    const { sut } = makeSut();

    const updatedUser = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    });

    expect(updatedUser).toBe(user);
  });
});

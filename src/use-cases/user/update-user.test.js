import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailAlredyInUseError } from '../../errors/users';

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

  it('should return a user updated successfully (with email)', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailRepositorySpy = jest.spyOn(
      getUserByEmailRepository,
      'execute',
    );

    const email = faker.internet.email();

    const updatedUser = await sut.execute(faker.string.uuid(), { email });

    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
    expect(updatedUser).toBe(user);
  });

  it('should return a user updated successfully (with password)', async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapter,
      'execute',
    );

    const password = faker.internet.password();

    const updatedUser = await sut.execute(faker.string.uuid(), { password });

    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
    expect(updatedUser).toBe(user);
  });

  it('should throw EmailAlreadyInUseError if email is already in use', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user);

    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    });

    await expect(promise).rejects.toThrow(
      new EmailAlredyInUseError(user.email),
    );
  });

  it('should call UpdateUserRepository with correct params', async () => {
    const { sut, updateUserRepository } = makeSut();
    const updateUserRepositorySpy = jest.spyOn(updateUserRepository, 'execute');

    const updateUserParams = {
      first_name: user.first_name,
      last_name: user.first_name,
      email: user.email,
      password: user.password,
    };

    await sut.execute(user.id, updateUserParams);

    expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
      first_name: user.first_name,
      last_name: user.first_name,
      email: user.email,
      password: 'password_hasher',
    });
  });

  it('should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepository } = makeSut();
    jest
      .spyOn(updateUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, {
      email: faker.internet.email(),
    });

    await expect(promise).rejects.toThrow();
  });

  it('should throw if PasswordHasherAdapter throws', async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, {
      password: faker.internet.password(),
    });

    await expect(promise).rejects.toThrow();
  });
});

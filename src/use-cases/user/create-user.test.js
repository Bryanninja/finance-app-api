import { jest } from '@jest/globals';
import { EmailAlredyInUseError } from '../../errors/users';
import { CreateUserUseCase } from './create-user.js';
import { userWithoutId } from '../../tests';

describe('CreateUserUseCase', () => {
  const user = userWithoutId;

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'hashed_password';
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
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

  it('should successfully create a user', async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute(user);

    expect(createdUser).toBeTruthy();
  });

  it('should throw EmailAlredyInUseError if GetUserByEmailRepository returns a user', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(user);

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow(
      new EmailAlredyInUseError(user.email),
    );
  });

  it('should call IdGeneratorAdapter to generate a random id', async () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute');

    await sut.execute(user);

    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  it('should call PasswordHasherAdpater to cryptograph password', async () => {
    const { sut, passwordHasherAdapter, createUserRepository } = makeSut();
    const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute');
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute');

    await sut.execute(user);

    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  it('should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGeneratorAdapter throws', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it('should throw if PasswordHasherAdapter throws', async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it('should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut();
    jest
      .spyOn(createUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });
});

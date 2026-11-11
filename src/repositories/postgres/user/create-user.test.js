import { jest } from '@jest/globals';
import { user } from '../../../tests/index.js';
import { PostgresCreateUserRepository } from './create-user';
import { prisma } from '../../../../prisma/prisma.js';

describe('CreateUserRepository', () => {
  it('should create a user in the database', async () => {
    const sut = new PostgresCreateUserRepository();

    const result = await sut.execute(user);

    expect(result.id).toBe(user.id);
    expect(result.first_name).toBe(user.first_name);
    expect(result.last_name).toBe(user.last_name);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });

  it('should call prisma.user.create with correct parameters', async () => {
    const sut = new PostgresCreateUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'create');

    await sut.execute(user);

    expect(prismaSpy).toHaveBeenCalledWith({
      data: user,
    });
  });

  it('should throw an error if prisma throws an error', async () => {
    const sut = new PostgresCreateUserRepository();
    jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });
});

import { jest } from '@jest/globals';
import { prisma } from '../../../../prisma/prisma';
import { PostgresUpdateUserRepository } from './update-user';
import { faker } from '@faker-js/faker';

describe('UpdateUserRepository', () => {
  const updateUserParams = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it('should update user on db', async () => {
    const user = await prisma.user.create({ data: updateUserParams });
    const sut = new PostgresUpdateUserRepository();

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toStrictEqual(updateUserParams);
  });

  it('should call prisma with correct params', async () => {
    const user = await prisma.user.create({ data: updateUserParams });
    const sut = new PostgresUpdateUserRepository();
    const spy = jest.spyOn(prisma.user, 'update');

    await sut.execute(user.id, updateUserParams);

    expect(spy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: updateUserParams,
    });
  });

  it('should throw an error if prisma throws an error', async () => {
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error());

    const promise = sut.execute(updateUserParams);

    await expect(promise).rejects.toThrow();
  });
});

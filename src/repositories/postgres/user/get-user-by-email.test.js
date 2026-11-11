import { jest } from '@jest/globals';
import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests';
import { PostgresGetUserByEmailRepository } from './get-user-by-email';

describe('GetUserByEmailRepository', () => {
  it('should get user by email on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByEmailRepository();

    const result = await sut.execute(fakeUser.email);

    expect(result).toStrictEqual(user);
  });

  it('should call prisma with correct params', async () => {
    const sut = new PostgresGetUserByEmailRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

    await sut.execute(fakeUser.email);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        email: fakeUser.email,
      },
    });
  });

  it('should throw an error if prisma throws an error', async () => {
    const sut = new PostgresGetUserByEmailRepository();
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.email);

    await expect(promise).rejects.toThrow();
  });
});

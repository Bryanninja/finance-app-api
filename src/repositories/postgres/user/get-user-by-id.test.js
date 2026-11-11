import { jest } from '@jest/globals';
import { user as fakeUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByIdRepository } from './get-user-by-id';

describe('GetUserByIdRepository', () => {
  it('should get user by id on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByIdRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual(user);
  });

  it('should call prisma with correct params', async () => {
    const sut = new PostgresGetUserByIdRepository();
    const spy = jest.spyOn(prisma.user, 'findUnique');

    await sut.execute(fakeUser.id);

    expect(spy).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },
    });
  });
});

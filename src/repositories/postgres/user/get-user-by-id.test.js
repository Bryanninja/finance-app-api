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
});

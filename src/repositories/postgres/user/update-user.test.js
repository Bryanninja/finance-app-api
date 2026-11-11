import { prisma } from '../../../../prisma/prisma';
import { PostgresUpdateUserRepository } from './update-user';
import { user as fakeUser } from '../../../tests';

describe('UpdateUserRepository', () => {
  it('should update user on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();

    const result = await sut.execute(user.id, { first_name: 'new name' });

    expect(result).toStrictEqual({
      ...user,
      first_name: 'new name',
    });
  });
});

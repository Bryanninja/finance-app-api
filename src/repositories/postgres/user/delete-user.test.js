import { prisma } from '../../../../prisma/prisma';
import { PostgresDeleteUserRepository } from './delete-user';
import { user } from '../../../tests';

describe('DeleteUserRepository', () => {
  it('should delete a user in the database', async () => {
    await prisma.user.create({
      data: user,
    });

    const sut = new PostgresDeleteUserRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual(user);
  });
});

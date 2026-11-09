import { jest } from '@jest/globals';
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

  it('should call prisma.user.delete with the correct parameters', async () => {
    const deleteSpy = jest.spyOn(prisma.user, 'delete');

    const sut = new PostgresDeleteUserRepository();

    await sut.execute(user.id);

    expect(deleteSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });
});

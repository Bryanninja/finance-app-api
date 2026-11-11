import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests';
import { PostgresGetUserBalanceRepository } from './get-user-balance';
import { TransactionType } from '@prisma/client';

describe('GetUserBalanceRepository', () => {
  it("should return the user's balance", async () => {
    await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.lorem.words(3),
          amount: 5000,
          type: 'EARNING',
          user_id: fakeUser.id,
          date: faker.date.recent(),
        },

        {
          name: faker.lorem.words(3),
          amount: 5000,
          type: 'EARNING',
          user_id: fakeUser.id,
          date: faker.date.recent(),
        },

        {
          name: faker.lorem.words(3),
          amount: 2000,
          type: 'EXPENSE',
          user_id: fakeUser.id,
          date: faker.date.recent(),
        },

        {
          name: faker.lorem.words(3),
          amount: 1000,
          type: 'INVESTMENT',
          user_id: fakeUser.id,
          date: faker.date.recent(),
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    const result = await sut.execute(fakeUser.id);

    expect(result.earnings.toString()).toBe('10000');
    expect(result.expenses.toString()).toBe('2000');
    expect(result.investments.toString()).toBe('1000');
    expect(result.balance.toString()).toBe('7000');
  });

  it('should call prisma with correct params', async () => {
    const sut = new PostgresGetUserBalanceRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    });
  });
});

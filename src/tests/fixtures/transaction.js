import { faker } from '@faker-js/faker';

export const transactionWithoutId = {
  user_id: faker.string.uuid(),
  name: faker.string.alphanumeric(10),
  date: faker.date.anytime().toISOString(),
  amount: Number(faker.finance.amount()),
  type: 'EXPENSE',
};

export const transaction = {
  ...transactionWithoutId,
  id: faker.string.uuid(),
};

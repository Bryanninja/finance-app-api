import { faker } from '@faker-js/faker';

export const userWithoutId = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

export const user = {
  ...userWithoutId,
  id: faker.string.uuid(),
};

export const userBalance = {
  earnings: faker.finance.amount(),
  expenses: faker.finance.amount(),
  investments: faker.finance.amount(),
  balance: faker.finance.amount(),
};

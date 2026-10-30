import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';

describe('GetUserByIdUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  const userId = faker.string.uuid();

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return {
      getUserByIdRepository,
      sut,
    };
  };

  it('should return a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual(user);
  });
});

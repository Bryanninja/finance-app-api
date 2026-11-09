import { user } from '../../../tests/index.js';
import { PostgresCreateUserRepository } from './create-user';

describe('CreateUserRepository', () => {
  it('should create a user in the database', async () => {
    const sut = new PostgresCreateUserRepository();

    const result = await sut.execute(user);

    expect(result.id).toBe(user.id);
    expect(result.first_name).toBe(user.first_name);
    expect(result.last_name).toBe(user.last_name);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });
});

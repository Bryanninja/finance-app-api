import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js';

export class DeleteUserUseCase {
  async execute(userId) {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository();
    const deleteUser = await postgresDeleteUserRepository.execute(userId);

    return deleteUser;
  }
}

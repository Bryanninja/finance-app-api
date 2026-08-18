import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js';

export class GetUserByIdUseCase {
  async execute(userId) {
    const GetUserByIdRepository = new PostgresGetUserByIdRepository();

    const user = await GetUserByIdRepository.execute(userId);

    return user;
  }
}

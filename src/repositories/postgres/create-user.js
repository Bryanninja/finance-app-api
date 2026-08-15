import { PostgresHelper } from '../../db/postgres/helper';

export class PostgresCreateUserRepository {
  async execute(creteUserParams) {
    // create user in postgres
    const result = await PostgresHelper.query(
      'INSERT INTO users (ID, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        creteUserParams.ID,
        creteUserParams.first_name,
        creteUserParams.last_name,
        creteUserParams.email,
        creteUserParams.password,
      ],
    );

    return result[0];
  }
}

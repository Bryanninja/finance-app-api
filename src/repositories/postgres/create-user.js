import { PostgresHelper } from '../../db/postgres/helper.js';

export class PostgresCreateUserRepository {
  async execute(createUserParams) {
    // create user in postgres
    await PostgresHelper.query(
      'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.id,
        createUserParams.first_name,
        createUserParams.last_name,
        createUserParams.email,
        createUserParams.password,
      ],
    );

    //Funciona perfeitamente! Mas no PostgreSQL, você pode economizar 1 ida ao banco fazendo tudo em 1 comando só com o RETURNING *:
    const createdUser = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1',
      [createUserParams.id],
    );

    return createdUser[0];
  }
}

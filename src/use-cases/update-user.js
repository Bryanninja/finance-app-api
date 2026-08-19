import { EmailAlredyInUseError } from '../errors/users.js';
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';
import bcrypt from 'bcrypt';
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-users.js';

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    //1. se o e-mail estiver sendo atualizado, verificar se ele já está em uso
    if (updateUserParams.email) {
      // verificar se o e-mail já está em uso
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();

      const userWithProvidedEmail =
        await postgresGetUserByEmailRepository.execute(updateUserParams.email);

      if (userWithProvidedEmail) {
        throw new EmailAlredyInUseError(updateUserParams.email);
      }
    }

    const user = {
      ...updateUserParams,
    };

    //2. se a senha estiver sendo atulizada, criptografá-la
    if (updateUserParams.password) {
      // criptografar a senha
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      user.password = hashedPassword;
    }

    //3. chamar o repository para atualizar o usuário
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updatedUser = await postgresUpdateUserRepository.execute(
      userId,
      user,
    );

    return updatedUser;
  }
}

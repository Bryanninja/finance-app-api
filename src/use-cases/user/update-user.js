import { EmailAlredyInUseError } from '../../errors/users.js';

import bcrypt from 'bcrypt';

export class UpdateUserUseCase {
  constructor(updateUserRepository, getUserByEmailRepository) {
    this.updateUserRepository = updateUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }
  async execute(userId, updateUserParams) {
    //1. se o e-mail estiver sendo atualizado, verificar se ele já está em uso
    if (updateUserParams.email) {
      // verificar se o e-mail já está em uso
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      );

      if (userWithProvidedEmail && userWithProvidedEmail.id != userId) {
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
    const updatedUser = await this.updateUserRepository.execute(userId, user);

    return updatedUser;
  }
}

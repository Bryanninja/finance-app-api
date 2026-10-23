import { EmailAlredyInUseError } from '../../errors/users.js';

export class UpdateUserUseCase {
  constructor(
    updateUserRepository,
    getUserByEmailRepository,
    passwordHasherAdapter,
  ) {
    this.updateUserRepository = updateUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
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
      const hashedPassword = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      );
      user.password = hashedPassword;
    }

    //3. chamar o repository para atualizar o usuário
    const updatedUser = await this.updateUserRepository.execute(userId, user);

    return updatedUser;
  }
}

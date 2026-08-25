import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { EmailAlredyInUseError } from '../../errors/users.js';

export class CreateUserUseCase {
  constructor(createUserRepository, getUserByEmailRepository) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }

  async execute(createUserParams) {
    // verificar se o e-mail já está em uso

    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (userWithProvidedEmail) {
      throw new EmailAlredyInUseError(createUserParams.email);
    }

    //gerar ID do usuario
    const userId = uuidv4();

    // criptografar a senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    //inserir o usúario no banco de dados
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    //chamar o repositorio
    const createdUser = await this.createUserRepository.execute(user);
    return createdUser;
  }
}

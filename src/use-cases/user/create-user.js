import { EmailAlredyInUseError } from '../../errors/users.js';

export class CreateUserUseCase {
  constructor(
    createUserRepository,
    getUserByEmailRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
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
    const userId = this.idGeneratorAdapter.execute();

    // criptografar a senha
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

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

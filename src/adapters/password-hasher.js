import bcrypt from 'bcrypt';

export class PasswordHasherAdapter {
  async execute(password) {
    return bcrypt.hash(password, 10);
  }
}

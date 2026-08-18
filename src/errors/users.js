export class EmailAlredyInUseError extends Error {
  constructor(email) {
    super(`The e-mail ${email} is already in use.`);
    this.name = 'EmailAlredyInUseError';
  }
}

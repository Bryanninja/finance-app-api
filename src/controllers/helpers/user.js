import { badRequest, notFound } from './index.js';
import validator from 'validator';

export const invalidPasswordResponse = () => {
  return badRequest({
    message: 'Password must be at least 6 characters',
  });
};

export const emailIsAlreadyInUseResponse = () => {
  return badRequest({
    message: 'Invalid E-mail. Please provide a valid one.',
  });
};

export const userNotFoundResponse = () => {
  return notFound({ message: 'User not found.' });
};

export const checkIfPasswordIsValid = (password) => password.length >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);

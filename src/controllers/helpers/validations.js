import validator from 'validator';
import { badRequest } from './index.js';

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () => {
  return badRequest({ message: 'The provided Id is not valid' });
};

export const requiredFieldsIsMissingResponse = (field) => {
  return badRequest({ message: `The field ${field} is required.` });
};

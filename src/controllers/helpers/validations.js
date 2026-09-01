import validator from 'validator';
import { badRequest } from './index.js';

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () => {
  return badRequest({ message: 'The provided Id is not valid' });
};

export const requiredFieldsIsMissingResponse = (field) => {
  return badRequest({ message: `The field ${field} is required.` });
};

export const checkIfIsString = (value) => typeof value === 'string';

export const validateRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const value = params[field];

    // 1. Verifica se o campo não foi enviado (undefined ou null)
    const fieldIsMissing = value === undefined || value === null;

    // 2. Se for uma string, verifica se ela é só espaços em branco ("   ")
    const fieldIsEmpty =
      checkIfIsString(value) &&
      validator.isEmpty(value, {
        ignore_whitespace: true,
      });

    if (fieldIsMissing || fieldIsEmpty) {
      return {
        missingField: field,
        ok: false,
      };
    }
  }

  return {
    ok: true,
    missingField: undefined,
  };
};

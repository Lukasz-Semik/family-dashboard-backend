import { isEmpty } from 'lodash';

import { isBlank, isEmail, hasProperLength } from '../helpers/validators';
import { emailErrors, passwordErrors } from '../constants/errors';

interface SignInErrors {
  email?: string;
  password?: string;
}

interface SignInValidator {
  isValid: boolean;
  errors: SignInErrors;
}

const validateEmail: (email: string) => string = email => {
  if (isBlank(email)) return emailErrors.isRequired;

  if (!isEmail(email)) return emailErrors.wrongFormat;

  return '';
};

const validatePassword: (password: string) => string = password => {
  if (isBlank(password)) return passwordErrors.isRequired;

  if (!hasProperLength(password, 6, 30)) return passwordErrors.wrongFormat;

  return '';
};

export const validateSignIn: (email: string, password: string) => SignInValidator = (
  email,
  password
) => {
  const errors: SignInErrors = {};

  const emailValidation: string = validateEmail(email);
  if (!isBlank(emailValidation)) errors.email = emailValidation;

  const passwordValidation: string = validatePassword(password);
  if (!isBlank(passwordValidation)) errors.password = passwordValidation;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

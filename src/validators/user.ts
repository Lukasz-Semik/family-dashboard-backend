import { isEmpty } from 'lodash';

import { isBlank, isEmail, hasProperLength } from '../helpers/validators';
import {
  emailErrors,
  passwordErrors,
  firstNameRequired,
  lastNameRequired,
} from '../constants/errors';

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

interface SignInErrors {
  email?: string;
  password?: string;
}

interface SignInValidator {
  isValid: boolean;
  errors: SignInErrors;
}

export const validateSignIn: (email: string, password: string) => SignInValidator = (
  email,
  password
) => {
  const errors: SignInErrors = {};

  const emailError: string = validateEmail(email);
  if (!isBlank(emailError)) errors.email = emailError;

  const passwordError: string = validatePassword(password);
  if (!isBlank(passwordError)) errors.password = passwordError;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

interface SignUpErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface SignUpValidator {
  isValid: boolean;
  errors: SignUpErrors;
}

export const validateSignUp: (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => SignUpValidator = (email, password, firstName, lastName) => {
  const errors: SignUpErrors = {};

  const signInValidated: SignInValidator = validateSignIn(email, password);

  const { email: emailError, password: passwordError } = signInValidated.errors;

  if (!isBlank(emailError)) errors.email = emailError;
  if (!isBlank(passwordError)) errors.password = passwordError;

  if (isBlank(firstName)) errors.firstName = firstNameRequired;
  if (isBlank(lastName)) errors.lastName = lastNameRequired;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

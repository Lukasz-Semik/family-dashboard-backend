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

  errors.email = validateEmail(email);
  errors.password = validatePassword(password);

  return {
    isValid: isBlank(errors.email) && isBlank(errors.password),
    errors,
  };
};

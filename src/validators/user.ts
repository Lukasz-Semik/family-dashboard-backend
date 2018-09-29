// TODO: Improve, add tests, add confirmation password into validators and controllers
import { isEmpty } from 'lodash';

import { isBlank, isEmail, hasProperLength } from '../helpers/validators';
import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';

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

interface SignInErrorsTypes {
  email?: string;
  password?: string;
}

interface SignInValidatorTypes {
  isValid: boolean;
  errors: SignInErrorsTypes;
}

export const validateSignIn: (email: string, password: string) => SignInValidatorTypes = (
  email,
  password
) => {
  const errors: SignInErrorsTypes = {};

  const emailError: string = validateEmail(email);
  if (!isBlank(emailError)) errors.email = emailError;

  const passwordError: string = validatePassword(password);
  if (!isBlank(passwordError)) errors.password = passwordError;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

interface SignUpErrorsTypes {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface SignUpValidatorTypes {
  isValid: boolean;
  errors: SignUpErrorsTypes;
}

export const validateSignUp: (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => SignUpValidatorTypes = (email, password, firstName, lastName) => {
  const errors: SignUpErrorsTypes = {};

  const signInValidated: SignInValidatorTypes = validateSignIn(email, password);

  const { email: emailError, password: passwordError } = signInValidated.errors;

  if (!isBlank(emailError)) errors.email = emailError;
  if (!isBlank(passwordError)) errors.password = passwordError;

  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

interface InviteErrorsTypes {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface InviteValidatorTypes {
  isValid: boolean;
  errors: InviteErrorsTypes;
}

export const validateInvite: (
  email: string,
  firstName: string,
  lastName: string
) => InviteValidatorTypes = (email, firstName, lastName) => {
  const errors: InviteErrorsTypes = {};

  const emailError: string = validateEmail(email);
  if (!isBlank(emailError)) errors.email = emailError;
  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

interface ConfirmInvitedErrorsTypes {
  password?: string;
  invitationToken?: string;
}

interface ConfirmInvitedValidatorTypes {
  isValid: boolean;
  errors: ConfirmInvitedErrorsTypes;
}

export const validateConfirmationInvited: (
  password: string,
  invitationToken: string
) => ConfirmInvitedValidatorTypes = (password, invitationToken) => {
  const errors: ConfirmInvitedErrorsTypes = {};

  const passwordError: string = validatePassword(password);

  if (!isBlank(passwordError)) errors.password = passwordError;
  if (isBlank(invitationToken)) errors.invitationToken = defaultErrors.isRequired;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

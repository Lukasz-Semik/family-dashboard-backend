interface InternalServeErrorsTypes {
  sthWrong: string;
}

export const internalServerErrors: InternalServeErrorsTypes = {
  sthWrong: 'something-went-wrong-server-side',
};

interface EmailErrors {
  emailTaken: string;
  wrongFormat: string;
  notExist: string;
  notVerified: string;
  isRequired: string;
  hasFamily: string;
  hasNoFamily: string;
}

export const emailErrors: EmailErrors = {
  emailTaken: 'email-already-registered',
  wrongFormat: 'email-wrong-format',
  notExist: 'email-not-exist',
  notVerified: 'email-not-verified',
  isRequired: 'email-required',
  hasFamily: 'email-is-assigned-to-family',
  hasNoFamily: 'email-is-not-assigned-to-family',
};

interface PasswordErrors {
  wrongFormat: string;
  notEqual: string;
  notValid: string;
  isRequired: string;
}

export const passwordErrors: PasswordErrors = {
  wrongFormat: 'password-wrong-format',
  notEqual: 'passwords-not-equal',
  notValid: 'password-not-valid',
  isRequired: 'password-required',
};

interface DefaultErrorsTypes {
  isRequired: string;
  notAllowedValue: string;
  emptyPayload: string;
}

export const defaultErrors: DefaultErrorsTypes = {
  isRequired: 'is-required',
  notAllowedValue: 'not-allowed-value',
  emptyPayload: 'empty-payload',
};

interface InternalServeErrorsTypes {
  sthWrong: string;
}

export const internalServerErrors: InternalServeErrorsTypes = {
  sthWrong: 'something-went-wrong-server-side',
};

interface EmailErrors {
  emailTaken: string;
  wrongFormat: string;
  isRequired: string;
}

export const emailErrors: EmailErrors = {
  emailTaken: 'email-already-registered',
  wrongFormat: 'email-wrong-format',
  isRequired: 'email-required',
};

interface PasswordErrors {
  wrongFormat: string;
  isRequired: string;
  notEqual: string;
}

export const passwordErrors: PasswordErrors = {
  wrongFormat: 'password-wrong-format',
  isRequired: 'password-required',
  notEqual: 'passwords-not-equal',
};

interface DefaultErrorsTypes {
  isRequired: string;
}

export const defaultErrors = {
  isRequired: 'is-required',
};

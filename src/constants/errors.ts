interface InternalServeErrorsTypes {
  sthWrong: string;
}

interface EmailErrors {
  emailTaken: string;
  wrongFormat: string;
  isRequired: string;
}

interface PasswordErrors {
  wrongFormat: string;
  isRequired: string;
  notEqual: string;
}

export const internalServerErrors: InternalServeErrorsTypes = {
  sthWrong: 'something-went-wrong-server-side',
};

export const emailErrors: EmailErrors = {
  emailTaken: 'email-already-registered',
  wrongFormat: 'email-wrong-format',
  isRequired: 'email-required',
};

export const passwordErrors: PasswordErrors = {
  wrongFormat: 'password-wrong-format',
  isRequired: 'password-required',
  notEqual: 'passwords-not-equal',
};

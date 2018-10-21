interface InternalServeErrorsTypes {
  sthWrong: string;
}

export const internalServerErrors: InternalServeErrorsTypes = {
  sthWrong: 'something-went-wrong-server-side',
};

interface EmailErrorsTypes {
  emailTaken: string;
  wrongFormat: string;
  notExist: string;
  notVerified: string;
  isRequired: string;
}

export const emailErrors: EmailErrorsTypes = {
  emailTaken: 'email-already-registered',
  wrongFormat: 'email-wrong-format',
  notExist: 'email-not-exist',
  notVerified: 'email-not-verified',
  isRequired: 'email-required',
};

interface UserErrorsTypes {
  hasFamily: string;
  hasNoFamily: string;
  familyHeadNotRemovable: string;
  isNoFamilyHead: string;
  assignItself: string;
}

export const userErrors: UserErrorsTypes = {
  hasFamily: 'email-is-assigned-to-family',
  hasNoFamily: 'email-is-not-assigned-to-family',
  familyHeadNotRemovable: 'email-family-head-not-removable',
  isNoFamilyHead: 'email-is-no-family-head',
  assignItself: 'email-assign-itself',
};

interface PasswordErrorsTypes {
  wrongFormat: string;
  notEqual: string;
  notValid: string;
  isRequired: string;
}

export const passwordErrors: PasswordErrorsTypes = {
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

interface FamilyErrorsTypes {
  tooSmall: string;
  noSuchUser: string;
}

export const familyErrors: FamilyErrorsTypes = {
  tooSmall: 'family-too-small',
  noSuchUser: 'family-no-such-user',
};

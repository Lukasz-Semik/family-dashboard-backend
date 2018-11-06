// TODO: make correction in errors
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
  alreadyVerified: string;
  isRequired: string;
}

export const emailErrors: EmailErrorsTypes = {
  emailTaken: 'email-already-registered',
  wrongFormat: 'email-wrong-format',
  notExist: 'email-not-exist',
  notVerified: 'email-not-verified',
  alreadyVerified: 'email-already-verified',
  isRequired: 'email-required',
};

interface UserErrorsTypes {
  hasFamily: string;
  hasNoFamily: string;
  familyHeadNotRemovable: string;
  isNoFamilyHead: string;
  assignItself: string;
  hasNoPermissions: string;
  notFromFamily: string;
}

export const userErrors: UserErrorsTypes = {
  hasFamily: 'user-is-assigned-to-family',
  hasNoFamily: 'user-is-not-assigned-to-family',
  familyHeadNotRemovable: 'user-family-head-not-removable',
  isNoFamilyHead: 'user-is-no-family-head',
  assignItself: 'user-assign-itself',
  hasNoPermissions: 'user-has-no-permissions',
  notFromFamily: 'user-not-from-family',
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
  notFound: string;
}

export const defaultErrors: DefaultErrorsTypes = {
  isRequired: 'is-required',
  notAllowedValue: 'not-allowed-value',
  emptyPayload: 'empty-payload',
  notFound: 'not-found',
};

interface FamilyErrorsTypes {
  tooSmall: string;
  noSuchUser: string;
}

export const familyErrors: FamilyErrorsTypes = {
  tooSmall: 'family-too-small',
  noSuchUser: 'family-no-such-user',
};

interface TodoErrorsTypes {
  alreadyDone: string;
  alreadyEmpty: string;
}

export const todosErrors: TodoErrorsTypes = {
  alreadyDone: 'todo-already-done',
  alreadyEmpty: 'todos-already-empty',
};

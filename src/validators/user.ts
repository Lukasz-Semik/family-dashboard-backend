// TODO: Improve, add tests
import { isEmpty } from 'lodash';

import { isBlank, isEmail, hasProperLength } from '../helpers/validators';
import { emailErrors, passwordErrors, defaultErrors, familyErrors } from '../constants/errors';
import { GENDERS } from '../constants/columnTypes';
import allowedUpdateUserDataKeys from '../constants/updateUserDataKeys';

export const validateEmail: (email: string) => string = email => {
  if (isBlank(email)) return emailErrors.isRequired;

  if (!isEmail(email)) return emailErrors.wrongFormat;

  return '';
};

export const validatePassword: (password: string) => string = password => {
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
  gender?: string;
  age?: string;
}

interface SignUpValidatorTypes {
  isValid: boolean;
  errors: SignUpErrorsTypes;
}

export const validateSignUp: (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  gender: string,
  age: number
) => SignUpValidatorTypes = (email, password, firstName, lastName, gender, age) => {
  const errors: SignUpErrorsTypes = {};

  const signInValidated: SignInValidatorTypes = validateSignIn(email, password);

  const { email: emailError, password: passwordError } = signInValidated.errors;

  if (!isBlank(emailError)) errors.email = emailError;
  if (!isBlank(passwordError)) errors.password = passwordError;

  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;
  if (!GENDERS.includes(gender)) errors.gender = defaultErrors.notAllowedValue;
  if (!age && age !== 0) errors.age = defaultErrors.isRequired;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

interface InviteErrorsTypes {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: string;
}

interface InviteValidatorTypes {
  isValid: boolean;
  errors: InviteErrorsTypes;
}

export const validateInvite: (
  email: string,
  firstName: string,
  lastName: string,
  gender: string,
  age: number
) => InviteValidatorTypes = (email, firstName, lastName, gender, age) => {
  const errors: InviteErrorsTypes = {};

  const emailError: string = validateEmail(email);
  if (!isBlank(emailError)) errors.email = emailError;
  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;
  if (!GENDERS.includes(gender)) errors.gender = defaultErrors.notAllowedValue;
  if (!age && age !== 0) errors.age = defaultErrors.isRequired;

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

export const checkIsProperUpdateUserPayload: (payload: object) => boolean = payload => {
  const payloadKeys: string[] = Object.keys(payload);

  let isPayloadValid: boolean = true;

  payloadKeys.forEach(key => {
    if (!allowedUpdateUserDataKeys.includes(key) || isEmpty(payload[key])) isPayloadValid = false;
  });

  return isPayloadValid;
};

interface UserAssigningFamilyHeadErrorsTypes {
  email?: string;
  userToAssignId?: string;
}

interface UserAssingFamilyHeadValidatorErrrorsTypes {
  isValid: boolean;
  errors: UserAssigningFamilyHeadErrorsTypes;
}

interface UserRequiredFieldTypes {
  isFamilyHead: boolean;
  hasFamily: boolean;
  family?: object;
  id: number;
}

export const validateUserAssigningFamilyHead: (
  user: UserRequiredFieldTypes,
  userToAssignId: number
) => UserAssingFamilyHeadValidatorErrrorsTypes = (user, userToAssignId) => {
  const errors: UserAssigningFamilyHeadErrorsTypes = {};

  if (!userToAssignId)
    return {
      errors: { userToAssignId: defaultErrors.isRequired },
      isValid: false,
    };

  if (Number(user.id) === Number(userToAssignId)) errors.email = emailErrors.assignItself;

  if (!user.isFamilyHead) errors.email = emailErrors.isNoFamilyHead;

  if (!user.hasFamily || isEmpty(user.family)) errors.email = emailErrors.hasNoFamily;

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

interface UserToAssignFamilyHeadErrorTypes {
  userToAssignId?: string;
  family?: string;
}

interface UserToAssignFamilyHeadValidatorErrorTypes {
  isValid: boolean;
  errors: UserToAssignFamilyHeadErrorTypes;
}

interface FamilyUsersRequiredFields {
  id: number;
}

export const validateUserToAssignFamilyHead: (
  id: number,
  familyUsers: FamilyUsersRequiredFields[]
) => UserToAssignFamilyHeadValidatorErrorTypes = (id, familyUsers) => {
  const errors: UserToAssignFamilyHeadErrorTypes = {};

  if (!id) errors.userToAssignId = defaultErrors.isRequired;

  if (familyUsers.length < 2) errors.family = familyErrors.tooSmall;

  if (isEmpty(errors.family) && !familyUsers.map(u => u.id).includes(id))
    errors.family = familyErrors.noSuchUser;

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

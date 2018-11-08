import { isEmpty } from 'lodash';
import * as moment from 'moment';

import { isBlank, isEmail, hasProperLength } from '../helpers/validators';
import {
  emailErrors,
  userErrors,
  passwordErrors,
  defaultErrors,
  familyErrors,
} from '../constants/errors';
import { GENDERS } from '../constants/columnTypes';
import { RES_NOT_FOUND, RES_FORBIDDEN, RES_CONFLICT } from '../constants/resStatuses';

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
  birthDate?: string;
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
  birthDate: string
) => SignUpValidatorTypes = (email, password, firstName, lastName, gender, birthDate) => {
  const errors: SignUpErrorsTypes = {};

  const signInValidated: SignInValidatorTypes = validateSignIn(email, password);

  const { email: emailError, password: passwordError } = signInValidated.errors;

  if (!isBlank(emailError)) errors.email = emailError;
  if (!isBlank(passwordError)) errors.password = passwordError;

  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;
  if (!GENDERS.includes(gender)) errors.gender = defaultErrors.notAllowedValue;
  if (isBlank(birthDate) || !moment(birthDate).isValid())
    errors.birthDate = defaultErrors.notAllowedValue;

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
  birthDate?: string;
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
  birthDate: string
) => InviteValidatorTypes = (email, firstName, lastName, gender, birthDate) => {
  const errors: InviteErrorsTypes = {};

  const emailError: string = validateEmail(email);
  // TODO: refactor this shit
  if (!isBlank(emailError)) errors.email = emailError;
  if (isBlank(firstName)) errors.firstName = defaultErrors.isRequired;
  if (isBlank(lastName)) errors.lastName = defaultErrors.isRequired;
  if (!GENDERS.includes(gender)) errors.gender = defaultErrors.notAllowedValue;
  if (isBlank(birthDate) || !moment(birthDate).isValid())
    errors.birthDate = defaultErrors.notAllowedValue;

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
  isVerified: boolean;
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

  if (Number(user.id) === Number(userToAssignId)) errors.email = userErrors.assignItself;

  if (!user.isFamilyHead) errors.email = userErrors.isNoFamilyHead;

  if (!user.hasFamily || isEmpty(user.family)) errors.email = userErrors.hasNoFamily;

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

  if (isEmpty(errors) && !familyUsers.map(u => u.id).includes(Number(id)))
    errors.family = familyErrors.noSuchUser;

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

// / TODO: validateUserPermission
//       if (isEmpty(currentUser))
//         return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

//       if (!currentUser.hasFamily || !currentUser.isFamilyHead)
//         return res.status(RES_FORBIDDEN).json({ errors: { user: userErrors.hasNoPermissions } });

// interface UserPermissionsErrorTypes {
//   notFound: string;
//   forbidden: string;

// }

// interface UserPermissionsValidatorErrorTypes {
//   isValid: boolean;
//   errors: UserPermissionsErrorTypes;
// }
// export const validateUserPermissions: (
//   user: UserRequiredFieldTypes
// ) => () => {}

interface UserPermissionsValidatorConfigTypes {
  checkIsVerified: boolean;
  checkHasFamily?: boolean;
  shouldHasFamily?: boolean;
  checkIsFamilyHead?: boolean;
}

interface UserPermissionsErrorTypes {
  email?: string;
  user?: string;
}
interface UserPermissionsValidatorErrorTypes {
  isValid: boolean;
  status: number;
  errors: UserPermissionsErrorTypes;
}

// isUser, isVerified

export const validateUserPermissions: (
  user: UserRequiredFieldTypes,
  config: UserPermissionsValidatorConfigTypes
) => UserPermissionsValidatorErrorTypes = (
  user,
  { checkIsVerified, checkIsFamilyHead, checkHasFamily }
) => {
  if (isEmpty(user))
    return {
      isValid: false,
      errors: { email: emailErrors.notExist },
      status: RES_NOT_FOUND,
    };

  const { isVerified, hasFamily, isFamilyHead } = user;

  if (checkIsFamilyHead && !isFamilyHead)
    return {
      isValid: false,
      errors: { user: userErrors.isNoFamilyHead },
      status: RES_FORBIDDEN,
    };

  if (checkHasFamily && !hasFamily)
    return {
      isValid: false,
      errors: { user: userErrors.hasNoFamily },
      status: RES_FORBIDDEN,
    };

  if (checkIsVerified && !isVerified)
    return {
      isValid: false,
      errors: { email: emailErrors.notVerified },
      status: RES_FORBIDDEN,
    };

  return {
    isValid: true,
    errors: {},
    status: null,
  };
};

import { defaultPassword } from '../constants/fixtures';
import { MALE } from '../constants/columnTypes';

export interface UserTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  isFamilyHead: boolean;
  hasFamily: boolean;
  isVerified: boolean;
}

export interface UserPayloadTypes {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  isFamilyHead?: boolean;
  hasFamily?: boolean;
  isVerified?: boolean;
}

export const generateUser: (payload: UserPayloadTypes) => UserTypes = ({
  email = 'default@email.com',
  firstName = 'John',
  lastName = 'Doe',
  birthDate = '1988-12-03',
  gender = MALE,
  isFamilyHead = false,
  hasFamily = false,
  isVerified = false,
}) => ({
  email,
  firstName,
  lastName,
  birthDate,
  gender,
  isFamilyHead,
  hasFamily,
  isVerified,
  password: defaultPassword,
});

export interface UsersTypes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  isFamilyHead: boolean;
  hasFamily: boolean;
  isVerified: boolean;
  token?: string;
  hasBigFamily?: boolean;
}

export const defaultPassword = 'Password123*';

export const generateUser = ({
  email = 'default@email.com',
  isFamilyHead = false,
  hasFamily = false,
  isVerified = false,
}) => ({
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1988-12-03',
  gender: 'male',
  password: defaultPassword,
  email,
  isFamilyHead,
  hasFamily,
  isVerified,
});

export const generateTodo = () => ({
  title: 'some-todos-title',
  description: 'some-todos-description',
});

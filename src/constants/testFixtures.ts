export interface UsersTypes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
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
  age: 21,
  gender: 'male',
  password: defaultPassword,
  email,
  isFamilyHead,
  hasFamily,
  isVerified,
});

export const generateTodoList = () => ({
  title: 'some-todo-list-title',
  description: 'some-todo-list-description',
});

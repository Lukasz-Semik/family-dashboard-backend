export const defaultPassword = 'Password123*';
export const familyMemberEmail = 'family-member-user@email.com';
// TODO: use generateUser from utils.
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

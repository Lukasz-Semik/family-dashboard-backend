interface UsersTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const users: UsersTypes[] = [
  {
    firstName: 'John',
    lastName: 'Test-created',
    email: 'john@existing.com',
    password: 'Password123',
  },
  {
    firstName: 'Jane',
    lastName: 'Seed-1',
    email: 'jane@seed-1.com',
    password: 'Password123',
  },
  {
    firstName: 'George',
    lastName: 'Seed-2-signed-in',
    email: 'george@seed-2-signed-in.com',
    password: 'Password123',
  },
];

interface UsersTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  isFamilyHead?: boolean;
}

export const users: UsersTypes[] = [
  {
    firstName: 'John',
    lastName: 'Test-created',
    age: 23,
    gender: 'male',
    email: 'john@existing.com',
    password: 'Password123',
  },
  {
    firstName: 'Jane',
    lastName: 'Seed-1',
    age: 21,
    gender: 'female',
    email: 'jane@seed-1.com',
    password: 'Password123',
  },
  {
    firstName: 'George',
    lastName: 'Seed-2-signed-in',
    age: 20,
    gender: 'male',
    email: 'george@seed-2-signed-in.com',
    password: 'Password123',
  },
  {
    firstName: 'Kate',
    lastName: 'Seed-3-not-verified',
    age: 33,
    gender: 'female',
    email: 'kate@seed-3-not-verified.com',
    password: 'Password123',
  },
];

export const wrongToken: string =
  // tslint:disable-next-line max-line-length
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZUBzZWVkLTItc2lnbmVkLWluLW5vdC12YWxpZC1tb2NrZWQuY29tIiwiaWF0IjoxNTM3MjEwNDAzLCJleHAiOjE1Mzg0MjAwMDN9.NqtSZcqzGkByKJJY-DjqUfFIUqmNYrKgsne1eqHVQMQ';

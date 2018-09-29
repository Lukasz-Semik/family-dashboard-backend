interface UsersTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  isFamilyHead: boolean;
  hasFamily: boolean;
  isVerified: boolean;
}

export const users: UsersTypes[] = [
  {
    firstName: 'John',
    lastName: 'Test-created',
    age: 23,
    gender: 'male',
    email: 'john@test-created.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Jane',
    lastName: 'Seed-1',
    age: 21,
    gender: 'female',
    email: 'jane@seed-1.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'George',
    lastName: 'Seed-2-signed-in',
    age: 20,
    gender: 'male',
    email: 'george@seed-2-signed-in.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Kate',
    lastName: 'Seed-3-not-verified',
    age: 33,
    gender: 'female',
    email: 'kate@seed-3-not-verified.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Brian',
    lastName: 'Seed-4-family-creator',
    age: 23,
    gender: 'male',
    email: 'brian@4-family-creator.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Marry',
    lastName: 'Seed-5-family-owner',
    age: 23,
    gender: 'male',
    email: 'marry@5-family-creator.com',
    password: 'Password123',
    isFamilyHead: true,
    hasFamily: true,
    isVerified: false,
  },
  {
    firstName: 'Tony',
    lastName: 'Invited one',
    age: 12,
    gender: 'male',
    email: 'tony@6-invited-one.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Hermiona',
    lastName: 'Invited to confirm',
    age: 14,
    gender: 'female',
    email: 'hermiona@7-invited-to-confirm.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: true,
    isVerified: false,
  },
];

export const wrongToken: string =
  // tslint:disable-next-line max-line-length
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZUBzZWVkLTItc2lnbmVkLWluLW5vdC12YWxpZC1tb2NrZWQuY29tIiwiaWF0IjoxNTM3MjEwNDAzLCJleHAiOjE1Mzg0MjAwMDN9.NqtSZcqzGkByKJJY-DjqUfFIUqmNYrKgsne1eqHVQMQ';

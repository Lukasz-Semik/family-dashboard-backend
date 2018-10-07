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
  isUserToConfirm?: boolean;
  isUserToDelete?: boolean;
}

export const notSeededUsers: UsersTypes[] = [
  {
    // descr: user to create
    firstName: 'Harry',
    lastName: 'Potter',
    age: 23,
    gender: 'male',
    email: 'harry@potter.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
];

export const seededUsers: UsersTypes[] = [
  {
    // descr: user to check sign in
    firstName: 'Hermiona',
    lastName: 'Granger',
    age: 21,
    gender: 'female',
    email: 'hermiona@granger.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: true,
  },
  {
    // descr: user to confirm
    firstName: 'Ron',
    lastName: 'Weasley',
    age: 19,
    gender: 'male',
    email: 'ron@weasley.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
    isUserToConfirm: true,
  },
  {
    // descr: user to update, check authorization, delete
    firstName: 'Minerva',
    lastName: 'McGonagall',
    age: 70,
    gender: 'female',
    email: 'minerva@mcgonagall.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
    isUserToDelete: true,
  },
];

// export const users: UsersTypes[] = [
//   {
//     firstName: 'John',
//     lastName: 'Test-created',
//     age: 23,
//     gender: 'male',
//     email: 'john@test-created.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//   },
//   {
//     firstName: 'Jane',
//     lastName: 'Seed-1',
//     age: 21,
//     gender: 'female',
//     email: 'jane@seed-1.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//   },
//   {
//     firstName: 'George',
//     lastName: 'Seed-2-signed-in',
//     age: 20,
//     gender: 'male',
//     email: 'george@seed-2-signed-in.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//   },
//   {
//     firstName: 'Kate',
//     lastName: 'Seed-3-not-verified',
//     age: 33,
//     gender: 'female',
//     email: 'kate@seed-3-not-verified.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//   },
//   {
//     firstName: 'Brian',
//     lastName: 'Seed-4-family-creator',
//     age: 23,
//     gender: 'male',
//     email: 'brian@4-family-creator.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//   },
//   {
//     firstName: 'Marry',
//     lastName: 'Seed-5-family-owner',
//     age: 23,
//     gender: 'male',
//     email: 'marry@5-family-creator.com',
//     password: 'Password123',
//     isFamilyHead: true,
//     hasFamily: true,
//     isVerified: true,
//   },
//   {
//     firstName: 'Tony',
//     lastName: 'Invited one',
//     age: 12,
//     gender: 'male',
//     email: 'tony@6-invited-one.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//   },
//   {
//     firstName: 'Hermiona',
//     lastName: 'Invited to confirm',
//     age: 14,
//     gender: 'female',
//     email: 'hermiona@7-invited-to-confirm.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: true,
//     isVerified: false,
//   },
//   {
//     firstName: 'Harry',
//     lastName: 'To update',
//     age: 11,
//     gender: 'male',
//     email: 'harry@8-to-update.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: true,
//     isVerified: true,
//   },
// ];

export const wrongToken: string =
  // tslint:disable-next-line max-line-length
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRqcGx1a2ktMUBnbWFpbC5jb20iLCJpYXQiOjE1MzgyMTMwMDksImV4cCI6MTUzOTQyMjYwOX0.V7JLVP6RSe0ULix4viQo4RyHX931UutaP9HXgfKXIX8';

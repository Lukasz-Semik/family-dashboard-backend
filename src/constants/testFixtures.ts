export interface UsersTypes {
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

export const notSeededUsers: UsersTypes[] = [
  {
    firstName: 'Harry',
    lastName: 'Potter',
    age: 23,
    gender: 'male',
    email: 'harry@potter.com',
    password: defaultPassword,
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Syriusz',
    lastName: 'Black',
    age: 50,
    gender: 'male',
    email: 'syriusz@black.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: false,
  },
  {
    firstName: 'Draco',
    lastName: 'Malfoy',
    age: 12,
    gender: 'male',
    email: 'draco@malfoy.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: true,
    isVerified: true,
  },
];

export const seededUsers: UsersTypes[] = [
  {
    firstName: 'Hermiona',
    lastName: 'Granger',
    age: 21,
    gender: 'female',
    email: 'hermiona@granger.com',
    password: defaultPassword,
    isFamilyHead: false,
    hasFamily: false,
    isVerified: true,
  },
  {
    firstName: 'Ron',
    lastName: 'Weasley',
    age: 19,
    gender: 'male',
    email: 'ron@weasley.com',
    password: 'Password123',
    isFamilyHead: true,
    hasFamily: true,
    isVerified: true,
  },
  {
    firstName: 'Minerva',
    lastName: 'McGonagall',
    age: 70,
    gender: 'female',
    email: 'minerva@mcgonagall.com',
    password: 'Password123',
    isFamilyHead: true,
    hasFamily: true,
    isVerified: true,
    hasBigFamily: true,
  },
  {
    firstName: 'Giny',
    lastName: 'Weasley',
    age: 10,
    gender: 'female',
    email: 'giny@weasley.com',
    password: 'Password123',
    isFamilyHead: true,
    hasFamily: true,
    isVerified: true,
  },
  {
    firstName: 'Albus',
    lastName: 'Dumbledore',
    age: 183,
    gender: 'male',
    email: 'albus@dumbledore.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: true,
  },
  {
    firstName: 'Alastor',
    lastName: 'Moody',
    age: 40,
    gender: 'male',
    email: 'alastor@moody.com',
    password: 'Password123',
    isFamilyHead: false,
    hasFamily: false,
    isVerified: true,
  },
];

// interface UsersTypes {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   age: number;
//   gender: string;
//   isFamilyHead: boolean;
//   hasFamily: boolean;
//   isVerified: boolean;
//   isUserToConfirm?: boolean;
//   isUserToDelete?: boolean;
//   isUserToDeleteWithFamily?: boolean;
//   isUserToFailDeleteWithFamily?: boolean;
//   isUserToConfirmInvite?: boolean;
//   isFamilyCreator?: boolean;
//   isNotDeletedSignedInUser?: boolean;
// }

// export const notSeededUsers: UsersTypes[] = [
//   {
//     // descr: user to create
//     firstName: 'Harry',
//     lastName: 'Potter',
//     age: 23,
//     gender: 'male',
//     email: 'harry@potter.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//   },
//   {
//     // descr: user to be a mocked one
//     firstName: 'Syriusz',
//     lastName: 'Black',
//     age: 50,
//     gender: 'male',
//     email: 'syriusz@black.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: true,
//     isVerified: false,
//   },
//   {
//     // descr: user to be invited
//     firstName: 'Draco',
//     lastName: 'Malfoy',
//     age: 12,
//     gender: 'male',
//     email: 'draco@malfoy.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//   },
// ];

// export const seededUsers: UsersTypes[] = [
//   {
//     // descr: user to check sign in
//     firstName: 'Hermiona',
//     lastName: 'Granger',
//     age: 21,
//     gender: 'female',
//     email: 'hermiona@granger.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//   },
//   {
//     // descr: user to confirm
//     firstName: 'Ron',
//     lastName: 'Weasley',
//     age: 19,
//     gender: 'male',
//     email: 'ron@weasley.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//     isUserToConfirm: true,
//   },
//   {
//     // descr: user to update, check authorization, delete
//     firstName: 'Minerva',
//     lastName: 'McGonagall',
//     age: 70,
//     gender: 'female',
//     email: 'minerva@mcgonagall.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//     isUserToDelete: true,
//   },
//   {
//     // descr: user to update, check authorization, delete
//     firstName: 'Alastor',
//     lastName: 'Moody',
//     age: 40,
//     gender: 'male',
//     email: 'alastor@moody.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: false,
//     isUserToConfirmInvite: true,
//   },
//   // descr: user to delete with created family, but without more members
//   {
//     firstName: 'Albus',
//     lastName: 'Dumbledore',
//     age: 183,
//     gender: 'male',
//     email: 'albus@dumbledore.com',
//     password: 'Password123',
//     isFamilyHead: true,
//     hasFamily: true,
//     isVerified: true,
//     isUserToDeleteWithFamily: true,
//   },
//   {
//     // descr: user to fail delete due to member in family and beeing familyHead,
//     firstName: 'Giny',
//     lastName: 'Weasley',
//     age: 10,
//     gender: 'female',
//     email: 'giny@weasley.com',
//     password: 'Password123',
//     isFamilyHead: true,
//     hasFamily: true,
//     isVerified: true,
//     isUserToFailDeleteWithFamily: true,
//   },
//   {
//     // descr: user to create family,
//     firstName: 'Dean',
//     lastName: 'Thomas',
//     age: 40,
//     gender: 'male',
//     email: 'dean@thomas.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//     isFamilyCreator: true,
//   },
//   {
//     // descr: user to fail family get,
//     firstName: 'Lord',
//     lastName: 'Voldemort',
//     age: 123,
//     gender: 'male',
//     email: 'lord@voldemort.com',
//     password: 'Password123',
//     isFamilyHead: false,
//     hasFamily: false,
//     isVerified: true,
//     isNotDeletedSignedInUser: true,
//   },
// ];

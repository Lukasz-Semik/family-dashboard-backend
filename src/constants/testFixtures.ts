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

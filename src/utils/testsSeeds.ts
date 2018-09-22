import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { users } from '../constants/testFixtures';
import { User, UserProfile } from '../entity';
import Token from '../controllers/Token';

export let generatedToken: string = '';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  const userProfileRepository = getRepository(UserProfile);
  await userRepository.clear();

  const userOne = new User();
  const newUserProfileOne = new UserProfile();
  const userProfileOne = await userProfileRepository.save({
    ...newUserProfileOne,
    firstName: users[1].firstName,
    lastName: users[1].lastName,
    age: users[1].age,
    gender: users[1].gender,
    isFamilyHead: false,
  });

  const hashedPassword = await hash(users[1].password, 10);

  await userRepository.save({
    ...userOne,
    email: users[1].email,
    isVerified: true,
    password: hashedPassword,
    userProfile: userProfileOne,
  });

  const userTwo = new User();
  const newUserProfileTwo = new UserProfile();
  generatedToken = await Token.create({ email: users[2].email });

  // const newUserProfile = new UserProfile();

  const userProfileTwo = await userProfileRepository.save({
    ...newUserProfileTwo,
    firstName: users[2].firstName,
    lastName: users[2].lastName,
    age: users[2].age,
    gender: users[2].gender,
    isFamilyHead: false,
  });

  await userRepository.save({
    ...userTwo,
    email: users[2].email,
    password: hashedPassword,
    token: generatedToken,
    isVerified: true,
    userProfile: userProfileTwo,
  });

  const userThree = new User();
  const newUserProfileThree = new UserProfile();
  generatedToken = await Token.create({ email: users[3].email });

  const userProfileThree = await userProfileRepository.save({
    ...newUserProfileThree,
    firstName: users[3].firstName,
    lastName: users[3].lastName,
    age: users[3].age,
    gender: users[3].gender,
    isFamilyHead: false,
  });

  return await userRepository.save({
    ...userThree,
    email: users[3].email,
    password: hashedPassword,
    token: generatedToken,
    isVerified: false,
    userProfile: userProfileThree,
  });
};

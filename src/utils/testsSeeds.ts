// TODO: user isVerified from seedsinstead of setting it here
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { users } from '../constants/testFixtures';
import { User, Family } from '../entity';
import { Token } from '../controllers';

export let generatedToken: string = '';
export let familyCreatorGeneratedToken: string = '';
export let familyOwnerGeneratedToken: string = '';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  const familyRepository = getRepository(Family);

  await userRepository.clear();
  await familyRepository.query('DELETE FROM family;');

  const userOne = new User();
  const hashedPassword = await hash(users[1].password, 10);

  await userRepository.save({
    ...userOne,
    ...users[1],
    isVerified: true,
    password: hashedPassword,
  });

  const userTwo = new User();

  generatedToken = await Token.create({ email: users[2].email });

  await userRepository.save({
    ...userTwo,
    ...users[2],
    password: hashedPassword,
    token: generatedToken,
    isVerified: true,
  });

  const userThree = new User();

  await userRepository.save({
    ...userThree,
    ...users[3],
    password: hashedPassword,
    isVerified: false,
  });

  const userFour = new User();
  familyCreatorGeneratedToken = await Token.create({ email: users[4].email });

  await userRepository.save({
    ...userFour,
    ...users[4],
    password: hashedPassword,
    token: familyCreatorGeneratedToken,
    isVerified: true,
  });

  const userFive = new User();
  familyOwnerGeneratedToken = await Token.create({ email: users[5].email });

  const createdUserFive = await userRepository.save({
    ...userFive,
    ...users[5],
    token: familyOwnerGeneratedToken,
    isVerified: true,
  });

  const newFamily = new Family();

  return await familyRepository.save({
    ...newFamily,
    name: users[5].lastName,
    users: [createdUserFive],
  });
};

import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { users } from '../constants/testFixtures';
import { User } from '../entity';
import Token from '../controllers/Token';

export let generatedToken: string = '';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);

  await userRepository.clear();

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
  generatedToken = await Token.create({ email: users[3].email });

  return await userRepository.save({
    ...userThree,
    ...users[3],
    password: hashedPassword,
    token: generatedToken,
    isVerified: false,
  });
};

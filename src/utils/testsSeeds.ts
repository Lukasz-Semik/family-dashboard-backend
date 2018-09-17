import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { users } from '../constants/testFixtures';
import { User } from '../entity/User';
import Token from '../controllers/Token';

export let generatedToken: string = '';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  await userRepository.clear();

  const userOne = new User();
  let hashedPassword = await hash(users[1].password, 10);

  await userRepository.save({
    ...userOne,
    ...users[1],
    password: hashedPassword,
  });

  const userTwo = new User();

  generatedToken = await Token.create({ email: users[2].email });
  hashedPassword = await hash(users[2].password, 10);

  return await userRepository.save({
    ...userTwo,
    ...users[2],
    password: hashedPassword,
    token: generatedToken,
  });
};

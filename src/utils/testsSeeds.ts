import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';

import { User } from '../entity/User';
import { users } from '../constants/textFixtures';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  await userRepository.clear();

  const user = new User();

  return await userRepository.save({
    ...user,
    ...users[1],
  });
};

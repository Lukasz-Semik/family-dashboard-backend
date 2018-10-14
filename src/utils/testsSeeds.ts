// TODO: refactor this seeeds!
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { seededUsers, notSeededUsers, UsersTypes } from '../constants/testFixtures';
import { User, Family } from '../entity';
import { Token } from '../controllers';
import { defaultPassword } from '../constants/testFixtures';

export const dbSeedUsers: any = async () => {
  const connection = await createConnection();

  await connection.query('TRUNCATE TABLE "user", "family" RESTART IDENTITY;');
  const userRepository = getRepository(User);

  const familyRepository = getRepository(Family);

  const hashedPassword = await hash(defaultPassword, 10);

  seededUsers.forEach(async (seededUser, i) => {
    const newUser = new User();

    const createdUser = await userRepository.save({
      ...newUser,
      ...seededUser,
      password: hashedPassword,
    });

    if (seededUser.hasFamily) {
      const newFamily = new Family();

      const users: UsersTypes[] = [createdUser];

      if (seededUser.hasBigFamily) {
        const newFamilyMemberUser = new User();

        const familyMemberUser = await userRepository.save({
          ...newFamilyMemberUser,
          ...notSeededUsers[2],
          password: hashedPassword,
        });

        users.push(familyMemberUser);
      }

      await familyRepository.save({
        ...newFamily,
        name: createdUser.lastName,
        users,
      });
    }
  });
};

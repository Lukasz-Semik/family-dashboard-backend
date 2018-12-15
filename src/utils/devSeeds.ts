import { createConnection, getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import { User, Family } from '../entity';
import { generateUser } from './dataGenerators';
import { FEMALE } from '../constants/columnTypes';

const seedDbDevelopment = async () => {
  const connection = await createConnection();

  await connection.query(
    'TRUNCATE TABLE "user", "family", "todo", "shopping_list" RESTART IDENTITY;'
  );

  const userRepository = getRepository(User);
  const familyRepository = getRepository(Family);

  // Create family head

  const newFamilyHeadUser = new User();

  const familyHeadUserData = generateUser({
    email: 'semik.lukasz@gmail.com',
    firstName: 'Łukasz',
    lastName: 'Semik',
    birthDate: '1988-12-03',
    isFamilyHead: true,
    hasFamily: true,
    isVerified: true,
  });

  const hashedPassword = await hash(familyHeadUserData.password, 10);

  const familyHeadUser = await userRepository.save({
    ...newFamilyHeadUser,
    ...familyHeadUserData,
    password: hashedPassword,
  });

  const newFamily = new Family();

  await familyRepository.save({
    ...newFamily,
    name: familyHeadUser.lastName,
    users: [familyHeadUser],
  });

  // Create confirmed user without family
  const verifiedUserData = generateUser({
    email: 'djpluki@gmail.com',
    firstName: 'Magda',
    lastName: 'Semik',
    birthDate: '1988-12-03',
    gender: FEMALE,
    isVerified: true,
  });

  const newVerifiedUser = new User();

  await userRepository.save({
    ...newVerifiedUser,
    ...verifiedUserData,
    password: hashedPassword,
  });

  await connection.close();
};

seedDbDevelopment();

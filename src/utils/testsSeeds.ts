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
export let invitationGeneratedToken: string = '';
export let editGeneratedToken: string = '';

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  const familyRepository = getRepository(Family);

  await userRepository.clear();
  await familyRepository.query('DELETE FROM family;');

  const userOne = new User();
  const hashedPassword = await hash(users[1].password, 10);

  // jane@seed-1.com
  await userRepository.save({
    ...userOne,
    ...users[1],
    password: hashedPassword,
  });

  const userTwo = new User();

  generatedToken = await Token.create({ email: users[2].email });

  // Seed-2-signed-in
  await userRepository.save({
    ...userTwo,
    ...users[2],
    password: hashedPassword,
    token: generatedToken,
  });

  const userThree = new User();

  // kate@seed-3-not-verified.com
  await userRepository.save({
    ...userThree,
    ...users[3],
    password: hashedPassword,
  });

  const userFour = new User();
  familyCreatorGeneratedToken = await Token.create({ email: users[4].email });

  // brian@4-family-creator.com
  await userRepository.save({
    ...userFour,
    ...users[4],
    password: hashedPassword,
    token: familyCreatorGeneratedToken,
  });

  const userFive = new User();
  familyOwnerGeneratedToken = await Token.create({ email: users[5].email });

  // marry@5-family-creator.com
  const createdUserFive = await userRepository.save({
    ...userFive,
    ...users[5],
    token: familyOwnerGeneratedToken,
  });

  const newFamily = new Family();

  await familyRepository.save({
    ...newFamily,
    name: users[5].lastName,
    users: [createdUserFive],
  });

  // hermiona@7-invited-to-confirm.com
  const userSeven = new User();
  invitationGeneratedToken = await Token.create({ email: users[7].email });

  await userRepository.save({
    ...userSeven,
    ...users[7],
    invitationToken: invitationGeneratedToken,
  });

  const userEight = new User();
  editGeneratedToken = await Token.create({ email: users[8].email });

  return await userRepository.save({
    ...userEight,
    ...users[8],
    invitationToken: editGeneratedToken,
  });
};

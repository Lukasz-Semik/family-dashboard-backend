// TODO: refactor this seeeds!
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { seededUsers, notSeededUsers } from '../constants/testFixtures';
import { User, Family } from '../entity';
import { Token } from '../controllers';

export let generatedToken: string = '';
export let familyCreatorGeneratedToken: string = '';
export let familyOwnerGeneratedToken: string = '';
export let invitationGeneratedToken: string = '';
export let editGeneratedToken: string = '';

export let confirmationAccountTokenGenerated: string = '';
export let notExistingUserTokenGenerated: string = '';
export let signedInTokenGenerated: string = '';
export let toDeleteWithFamilyTokenGenerated: string = '';
export let toFailDeleteWithFamilyTokenGenerated: string = '';
export let invitationTokenGenerated: string = '';

interface UserTypes {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  password: string;
  isFamilyHead: boolean;
  hasFamily: boolean;
  isVerified: boolean;
  token?: string;
  confirmationAccountToken?: string;
  invitationToken?: string;
}

export const dbSeedTests: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  const familyRepository = getRepository(Family);

  await userRepository.clear();
  await familyRepository.query('DELETE FROM family;');

  // All users have the same password `Password123`
  const hashedPassword = await hash(seededUsers[0].password, 10);

  notExistingUserTokenGenerated = Token.create({ email: 'some-not-existing@email.com' });

  seededUsers.forEach(async seededUser => {
    const newUser = new User();
    const {
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      isFamilyHead,
      hasFamily,
      isVerified,
      isUserToConfirm,
      isUserToDelete,
      isUserToDeleteWithFamily,
      isUserToFailDeleteWithFamily,
      isUserToConfirmInvite,
    } = seededUser;

    const user: UserTypes = {
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      isFamilyHead,
      hasFamily,
      isVerified,
    };

    if (isUserToConfirm) {
      confirmationAccountTokenGenerated = Token.create({ email });
      user.confirmationAccountToken = confirmationAccountTokenGenerated;
    }

    if (isUserToDelete) {
      signedInTokenGenerated = Token.create({ email });
      user.token = signedInTokenGenerated;
    }

    if (isUserToDeleteWithFamily) {
      toDeleteWithFamilyTokenGenerated = Token.create({ email });
      user.token = toDeleteWithFamilyTokenGenerated;
    }

    if (isUserToFailDeleteWithFamily) {
      toFailDeleteWithFamilyTokenGenerated = Token.create({ email });
      user.token = toFailDeleteWithFamilyTokenGenerated;
    }

    if (isUserToConfirmInvite) {
      invitationTokenGenerated = Token.create({ email });
      user.invitationToken = invitationTokenGenerated;
    }

    const createdUser = await userRepository.save({
      ...newUser,
      ...user,
      password: hashedPassword,
    });

    if (isUserToDeleteWithFamily || isUserToFailDeleteWithFamily) {
      const newFamily = new Family();
      const users = [createdUser];

      if (isUserToFailDeleteWithFamily) {
        const newUserTwo = new User();

        const mockedFamilyMemberUser = await userRepository.save({
          ...newUserTwo,
          ...notSeededUsers[1],
        });

        users.push(mockedFamilyMemberUser);
      }

      await familyRepository.save({
        ...newFamily,
        name: createdUser.lastName,
        users,
      });
    }
  });

  // const userOne = new User();
  // await userRepository.save({
  //   ...userOne,
  //   ...seededUsers[0],
  //   password: hashedPassword,
  // });

  // const userTwo = new User();
  // await userRepository.save({
  //   ...userTwo,
  //   ...seededUsers[1],
  //   password: hashedPassword,
  // });

  // const userOne = new User();
  // const hashedPassword = await hash(users[1].password, 10);

  // // jane@seed-1.com
  // await userRepository.save({
  //   ...userOne,
  //   ...users[1],
  //   password: hashedPassword,
  // });

  // const userTwo = new User();

  // generatedToken = await Token.create({ email: users[2].email });

  // // Seed-2-signed-in
  // await userRepository.save({
  //   ...userTwo,
  //   ...users[2],
  //   password: hashedPassword,
  //   token: generatedToken,
  // });

  // const userThree = new User();

  // // kate@seed-3-not-verified.com
  // await userRepository.save({
  //   ...userThree,
  //   ...users[3],
  //   password: hashedPassword,
  // });

  // const userFour = new User();
  // familyCreatorGeneratedToken = await Token.create({ email: users[4].email });

  // // brian@4-family-creator.com
  // await userRepository.save({
  //   ...userFour,
  //   ...users[4],
  //   password: hashedPassword,
  //   token: familyCreatorGeneratedToken,
  // });

  // const userFive = new User();
  // familyOwnerGeneratedToken = await Token.create({ email: users[5].email });

  // // marry@5-family-creator.com
  // const createdUserFive = await userRepository.save({
  //   ...userFive,
  //   ...users[5],
  //   token: familyOwnerGeneratedToken,
  // });

  // const newFamily = new Family();

  // await familyRepository.save({
  //   ...newFamily,
  //   name: users[5].lastName,
  //   users: [createdUserFive],
  // });

  // // hermiona@7-invited-to-confirm.com
  // const userSeven = new User();
  // invitationGeneratedToken = await Token.create({ email: users[7].email });

  // await userRepository.save({
  //   ...userSeven,
  //   ...users[7],
  //   invitationToken: invitationGeneratedToken,
  // });

  // // harry@8-to-update.com
  // const userEight = new User();
  // editGeneratedToken = await Token.create({ email: users[8].email });

  // return await userRepository.save({
  //   ...userEight,
  //   ...users[8],
  //   token: editGeneratedToken,
  // });
};

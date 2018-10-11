// TODO: refactor this seeeds!
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm';
import { hash } from 'bcryptjs';

import { seededUsers, notSeededUsers, UsersTypes } from '../constants/testFixtures';
import { User, Family } from '../entity';
import { Token } from '../controllers';
import { defaultPassword } from '../constants/testFixtures';

export const dbSeedUsers: any = async () => {
  await createConnection();

  const userRepository = getRepository(User);
  await userRepository.clear();

  const familyRepository = getRepository(Family);
  await familyRepository.query('DELETE FROM family;');

  const hashedPassword = await hash(defaultPassword, 10);

  seededUsers.forEach(async seededUser => {
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

// export let generatedToken: string = '';
// export let familyCreatorGeneratedToken: string = '';
// export let familyOwnerGeneratedToken: string = '';
// export let invitationGeneratedToken: string = '';
// export let editGeneratedToken: string = '';

// export let confirmationAccountTokenGenerated: string = '';
// export let notExistingUserTokenGenerated: string = '';
// export let signedInTokenGenerated: string = '';
// export let toDeleteWithFamilyTokenGenerated: string = '';
// export let toFailDeleteWithFamilyTokenGenerated: string = '';
// export let invitationTokenGenerated: string = '';
// export let familyCreatorTokenGenerated: string = '';
// export let notDeletedSignedInTokenGenerated: string = '';

// interface UserTypes {
//   firstName: string;
//   lastName: string;
//   age: number;
//   gender: string;
//   email: string;
//   password: string;
//   isFamilyHead: boolean;
//   hasFamily: boolean;
//   isVerified: boolean;
//   token?: string;
//   confirmationAccountToken?: string;
//   invitationToken?: string;
// }

// export const dbSeedTests: any = async () => {
//   await createConnection();

//   const userRepository = getRepository(User);
//   const familyRepository = getRepository(Family);

//   await userRepository.clear();
//   await familyRepository.query('DELETE FROM family;');

//   // All users have the same password `Password123`
//   const hashedPassword = await hash(seededUsers[0].password, 10);

//   notExistingUserTokenGenerated = Token.create({ email: 'some-not-existing@email.com' });

//   seededUsers.forEach(async seededUser => {
//     const newUser = new User();
//     const {
//       firstName,
//       lastName,
//       age,
//       gender,
//       email,
//       password,
//       isFamilyHead,
//       hasFamily,
//       isVerified,
//       isUserToConfirm,
//       isUserToDelete,
//       isUserToDeleteWithFamily,
//       isUserToFailDeleteWithFamily,
//       isUserToConfirmInvite,
//       isFamilyCreator,
//       isNotDeletedSignedInUser,
//     } = seededUser;

//     const user: UserTypes = {
//       firstName,
//       lastName,
//       age,
//       gender,
//       email,
//       password,
//       isFamilyHead,
//       hasFamily,
//       isVerified,
//     };

//     if (isUserToConfirm) {
//       confirmationAccountTokenGenerated = Token.create({ email });
//       user.confirmationAccountToken = confirmationAccountTokenGenerated;
//     }

//     if (isUserToDelete) {
//       signedInTokenGenerated = Token.create({ email });
//       user.token = signedInTokenGenerated;
//     }

//     if (isUserToDeleteWithFamily) {
//       toDeleteWithFamilyTokenGenerated = Token.create({ email });
//       user.token = toDeleteWithFamilyTokenGenerated;
//     }

//     if (isUserToFailDeleteWithFamily) {
//       toFailDeleteWithFamilyTokenGenerated = Token.create({ email });
//       user.token = toFailDeleteWithFamilyTokenGenerated;
//     }

//     if (isUserToConfirmInvite) {
//       invitationTokenGenerated = Token.create({ email });
//       user.invitationToken = invitationTokenGenerated;
//     }

//     if (isFamilyCreator) {
//       familyCreatorTokenGenerated = Token.create({ email });
//       user.token = familyCreatorTokenGenerated;
//     }

//     if (isNotDeletedSignedInUser) {
//       notDeletedSignedInTokenGenerated = Token.create({ email });
//       user.token = notDeletedSignedInTokenGenerated;
//     }

//     const createdUser = await userRepository.save({
//       ...newUser,
//       ...user,
//       password: hashedPassword,
//     });

//     if (isUserToDeleteWithFamily || isUserToFailDeleteWithFamily) {
//       const newFamily = new Family();
//       const users = [createdUser];

//       if (isUserToFailDeleteWithFamily) {
//         const newUserTwo = new User();

//         const mockedFamilyMemberUser = await userRepository.save({
//           ...newUserTwo,
//           ...notSeededUsers[1],
//         });

//         users.push(mockedFamilyMemberUser);
//       }

//       await familyRepository.save({
//         ...newFamily,
//         name: createdUser.lastName,
//         users,
//       });
//     }
//   });
// };

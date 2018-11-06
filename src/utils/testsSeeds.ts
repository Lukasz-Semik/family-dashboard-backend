import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import {
  generateUser,
  generateTodo,
  defaultPassword,
  familyMemberEmail,
} from '../constants/testFixtures';
import { User, Family, Todo } from '../entity';

export const dbClear: any = async connection =>
  await connection.query('TRUNCATE TABLE "user", "family", "todo" RESTART IDENTITY;');

export const dbSeedUser: any = async ({ email, isVerified, isFamilyHead, hasFamily }) => {
  const userRepository = getRepository(User);

  const hashedPassword = await hash(defaultPassword, 10);

  const newUser = new User();

  const createdUser = await userRepository.save({
    ...newUser,
    ...generateUser({ email, isVerified, isFamilyHead, hasFamily }),
    password: hashedPassword,
  });

  return createdUser;
};

export const dbSeedFamily: any = async ({
  familyHeadEmail,
  hasBigFamily,
  hasTodos,
  hasMemberVerified = true,
  notDefaultFamilyMemberEmail = null,
}) => {
  const familyRepository = getRepository(Family);
  const todoListRepository = getRepository(Todo);

  const familyHead = await dbSeedUser({
    email: familyHeadEmail,
    isVerified: true,
    hasFamily: true,
    isFamilyHead: true,
  });

  let todo: any;

  let familyMember: any;

  const newFamily = new Family();

  const users = [familyHead];

  if (hasBigFamily) {
    familyMember = await dbSeedUser({
      email: notDefaultFamilyMemberEmail || familyMemberEmail,
      isVerified: hasMemberVerified,
      hasFamily: true,
    });

    users.push(familyMember);
  }

  if (hasTodos) {
    const newTodo = new Todo();

    todo = await todoListRepository.save({
      ...newTodo,
      ...generateTodo(),
      author: familyHead,
      isDone: false,
    });

    newFamily.todos = [todo];
  }

  await familyRepository.save({
    ...newFamily,
    name: familyHead.lastName,
    users,
  });

  return {
    familyHead,
    familyMember,
    todos: newFamily.todos,
  };
};

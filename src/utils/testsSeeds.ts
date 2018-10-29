import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import { generateUser, generateTodoList, defaultPassword } from '../constants/testFixtures';
import { User, Family, TodoList } from '../entity';

export const dbClear: any = async connection =>
  await connection.query('TRUNCATE TABLE "user", "family", "todo_list" RESTART IDENTITY;');

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

export const dbSeedFamily: any = async ({ familyHeadEmail, hasBigFamily, hasTodoList }) => {
  const familyRepository = getRepository(Family);
  const todoListRepository = getRepository(TodoList);

  const familyHead = await dbSeedUser({
    email: familyHeadEmail,
    isVerified: true,
    hasFamily: true,
    isFamilyHead: true,
  });

  let todoList: any;

  let familyMember: any;

  const newFamily = new Family();

  const users = [familyHead];

  if (hasBigFamily) {
    familyMember = await dbSeedUser({
      email: 'family-member-user@emailcom',
      isVerified: true,
      hasFamily: true,
    });

    users.push(familyMember);
  }

  if (hasTodoList) {
    const newTodoList = new TodoList();

    todoList = await todoListRepository.save({
      ...newTodoList,
      ...generateTodoList(),
      author: familyHead,
      isDone: false,
    });

    newFamily.todoLists = [todoList];
  }

  await familyRepository.save({
    ...newFamily,
    name: familyHead.lastName,
    users,
  });

  return {
    familyHead,
    familyMember,
    todoLists: newFamily.todoLists,
  };
};

import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import { generateUser, generateTodoList, defaultPassword } from '../constants/testFixtures';
import { User, Family, TodoList } from '../entity';

export const dbClear: any = async connection =>
  await connection.query('TRUNCATE TABLE "user", "family", "todo_list" RESTART IDENTITY;');

export const dbSeedUsers: any = async ({
  email,
  isVerified,
  isFamilyHead,
  hasFamily,
  hasBigFamily,
  hasTodoList,
}) => {
  const userRepository = getRepository(User);
  const familyRepository = getRepository(Family);
  const todoListRepository = getRepository(TodoList);

  const hashedPassword = await hash(defaultPassword, 10);

  const newUser = new User();

  const createdUser = await userRepository.save({
    ...newUser,
    ...generateUser({ email, isVerified, isFamilyHead, hasFamily }),
    password: hashedPassword,
  });

  if (!hasFamily)
    return {
      firstUser: createdUser,
    };

  let todoList: any;

  const newFamily = new Family();

  const users = [createdUser];

  let familyMemberUser: any;

  if (hasBigFamily) {
    const newFamilyMember = new User();

    familyMemberUser = await userRepository.save({
      ...newFamilyMember,
      ...generateUser({ email: 'family-member-user@emailcom', isVerified, hasFamily }),
      password: hashedPassword,
    });

    users.push(familyMemberUser);
  }

  if (hasTodoList) {
    const newTodoList = new TodoList();

    todoList = await todoListRepository.save({
      ...newTodoList,
      ...generateTodoList(),
      author: createdUser,
      isDone: false,
    });

    newFamily.todoLists = [todoList];
  }

  await familyRepository.save({
    ...newFamily,
    name: createdUser.lastName,
    users,
  });

  return {
    firstUser: createdUser,
    secondUser: familyMemberUser,
  };
};

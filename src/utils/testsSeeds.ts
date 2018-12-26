import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import { defaultPassword, familyMemberEmail } from '../constants/fixtures';
import { generateUser, generateMockedTodo, generateMockedShoppingList } from './dataGenerators';
import { User, Family, Todo, ShoppingList } from '../entity';
import { Token } from '../controllers/Token';
import { EXPIRE_10_M } from '../constants/expirations';

export const dbClear: any = async connection =>
  await connection.query(
    'TRUNCATE TABLE "user", "family", "todo", "shopping_list" RESTART IDENTITY;'
  );

export const dbSeedUser: any = async ({
  email,
  isVerified,
  isFamilyHead,
  hasFamily,
  hasResetPassToken,
}) => {
  const userRepository = getRepository(User);

  const hashedPassword = await hash(defaultPassword, 10);

  const resetPasswordToken = hasResetPassToken ? await Token.create({ email }, EXPIRE_10_M) : null;

  const newUser = new User();

  const createdUser = await userRepository.save({
    ...newUser,
    ...generateUser({ email, isVerified, isFamilyHead, hasFamily }),
    password: hashedPassword,
    resetPasswordToken,
  });

  return createdUser;
};

export const dbSeedFamily: any = async ({
  familyHeadEmail,
  hasBigFamily,
  hasTodos,
  hasShoppingLists,
  hasMemberVerified = true,
  notDefaultFamilyMemberEmail = null,
}) => {
  const familyRepository = getRepository(Family);
  const todoListRepository = getRepository(Todo);
  const shoppingListRepository = getRepository(ShoppingList);

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
      ...generateMockedTodo(),
      author: familyHead,
      isDone: false,
    });

    newFamily.todos = [todo];
  }

  if (hasShoppingLists) {
    const newShoppingList = new ShoppingList();

    const shoppingList = await shoppingListRepository.save({
      ...newShoppingList,
      ...generateMockedShoppingList(),
      author: familyHead,
      isDone: false,
    });

    newFamily.shoppingLists = [shoppingList];
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
    shoppingLists: newFamily.shoppingLists,
  };
};

const createUserSubQuery = userRole => [
  `${userRole}.id`,
  `${userRole}.firstName`,
  `${userRole}.lastName`,
];

export const familyItemWithAuthorExecutorUpdaterQuery = itemName => [
  'family',
  itemName,
  ...createUserSubQuery('author'),
  ...createUserSubQuery('executor'),
  ...createUserSubQuery('updater'),
];

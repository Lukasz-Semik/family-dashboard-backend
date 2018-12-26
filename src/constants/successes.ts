interface AccountSuccessesTypes {
  created: string;
  confirmed: string;
  invited: string;
  familyHeadAssigned: string;
  resetEmailPassSent: string;
  passwordIsReset: string;
}

export const accountSuccesses: AccountSuccessesTypes = {
  created: 'account-created',
  confirmed: 'account-confirmed',
  invited: 'account-invited',
  familyHeadAssigned: 'account-family-head-assigned',
  resetEmailPassSent: 'reset-password-email-is-sent',
  passwordIsReset: 'password-is-reset',
};

interface TodosSuccessesTypes {
  todoCreated: string;
  todosDeleted: string;
}

export const todosSuccesses: TodosSuccessesTypes = {
  todoCreated: 'todos-created',
  todosDeleted: 'todos-all-deleted',
};

interface ShoppingListsSuccessesTypes {
  shoppingListCreated: string;
  shoppingListsDeleted: string;
}

export const shoppingListsSuccesses: ShoppingListsSuccessesTypes = {
  shoppingListCreated: 'shopping-list-created',
  shoppingListsDeleted: 'shopping-lists-all-deleted',
};

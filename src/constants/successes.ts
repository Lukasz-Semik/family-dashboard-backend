interface AccountSuccessesTypes {
  created: string;
  confirmed: string;
  invited: string;
  familyHeadAssigned: string;
}

export const accountSuccesses: AccountSuccessesTypes = {
  created: 'account-created',
  confirmed: 'account-confirmed',
  invited: 'account-invited',
  familyHeadAssigned: 'account-family-head-assigned',
};

interface TodosSuccessesTypes {
  todoCreated: string;
  todosDeleted: string;
}

export const todosSuccesses: TodosSuccessesTypes = {
  todoCreated: 'todos-created',
  todosDeleted: 'todos-all-deleted',
};

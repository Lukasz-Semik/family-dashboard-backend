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

interface TodoListSuccessesTypes {
  todoListCreated: string;
}

export const todoListSuccesses: TodoListSuccessesTypes = {
  todoListCreated: 'todo-list-created',
};

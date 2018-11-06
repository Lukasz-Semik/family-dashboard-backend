export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

interface RouteFieldsTypes {
  base: string;
  fullRoute: string;
}

// User routes
export const API_USER_SIGN_UP: string = '/user/sign-up';
export const API_USER_SIGN_IN: string = '/user/sign-in';
export const API_USER_CONFIRM: string = '/user/confirm';
export const API_USER_UPDATE: string = '/user/update';
export const API_USER_DELETE: string = '/user/delete';
export const API_USER_IS_AUTHORIZED: string = '/user/is-authorized';
export const API_USER_GET_CURRENT: string = '/user/current';
export const API_USER_INVITE: string = '/user/invite';
export const API_USER_RESEND_INVITATION: string = '/user/resend-invitation';
export const API_USER_CONFIRM_INVITED: string = '/user/confirm-invited';
export const API_USER_ADD_TO_FAMILY: string = '/user/add-to-family';
export const API_USER_CONFIRM_ADDITION: string = '/user/confirm-addition';

// Family routes
export const API_FAMILY_CREATE: string = '/family/create';
export const API_FAMILY_GET: string = '/family/current';
export const API_FAMILY_ASSIGN_HEAD: string = '/family/head-assign';

// TodoList routes
export const todosBase = '/todos';
export const API_TODOS: string = todosBase;

export const API_TODO: (param?: number) => RouteFieldsTypes = param => ({
  base: `${todosBase}/:todoId`,
  fullRoute: `${generateFullApi(todosBase)}/${String(param)}`,
});

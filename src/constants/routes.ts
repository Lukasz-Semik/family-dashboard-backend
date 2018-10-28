export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

// User routes
export const API_USER_SIGN_UP: string = '/user/sign-up';
export const API_USER_SIGN_IN: string = '/user/sign-in';
export const API_USER_CONFIRM: string = '/user/confirm';
export const API_USER_UPDATE: string = '/user/update';
export const API_USER_DELETE: string = '/user/delete';
export const API_USER_IS_AUTHORIZED: string = '/user/is-authorized';
export const API_USER_GET_CURRENT: string = '/user/current';
export const API_USER_INVITE: string = '/user/invite';
export const API_USER_CONFIRM_INVITED: string = '/user/confirm-invited';

// Family routes
export const API_FAMILY_CREATE: string = '/family/create';
export const API_FAMILY_GET: string = '/family/current';
export const API_FAMILY_ASSIGN_HEAD: string = '/family/head-assign';

// TodoList routes
export const API_TODOLIST_CREATE: string = '/todolist/create';

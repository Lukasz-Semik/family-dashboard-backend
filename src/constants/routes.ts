export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

// User routes
export const API_SIGN_UP: string = '/user/sign-up';
export const API_SIGN_IN: string = '/user/sign-in';
export const API_USER_UPDATE: string = '/user/update';
export const API_USER_DELETE: string = '/user/delete';
export const API_IS_AUTHORIZED: string = '/user/is-authorized';
export const API_CONFIRM_ACCOUNT: string = '/user/confirm';
export const API_GET_CURRENT_USER: string = '/user/current';
export const API_INVITE_USER: string = '/user/invite';
export const API_CONFIRM_INVITED_USER: string = '/user/confirm-invited';

// Family routes
export const API_CREATE_FAMILY: string = '/family/create';
export const API_GET_FAMILY: string = '/family/current';

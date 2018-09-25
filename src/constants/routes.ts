export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

// User routes
export const API_SIGN_UP: string = '/user/sign-up';
export const API_SIGN_IN: string = '/user/sign-in';
export const API_IS_AUTHORIZED: string = '/user/is-authorized';
export const API_CONFIRM_ACCOUNT: string = '/user/confirm-account';
export const API_GET_CURRENT_USER: string = '/user/get-current-user';
export const API_INVITE_USER: string = '/user/invite-user';

// Family routes
export const API_CREATE_FAMILY: string = '/family/create-family';
export const API_GET_FAMILY: string = '/family/get-family';

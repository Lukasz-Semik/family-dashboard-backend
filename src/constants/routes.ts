export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

export const API_SIGN_UP: string = '/user/sign-up';
export const API_FULL_SIGN_UP: string = generateFullApi(API_SIGN_UP);

export const API_SIGN_IN: string = '/user/sign-in';
export const API_FULL_SIGN_IN: string = generateFullApi(API_SIGN_IN);

export const API_IS_AUTHORIZED: string = '/user/is-authorized';
export const API_FULL_IS_AUTHORIZED: string = generateFullApi(API_IS_AUTHORIZED);

export const API_CONFIRM_ACCOUNT: string = '/user/confirm-account';
export const API_FULL_CONFIRM_ACCOUNT: string = generateFullApi(API_CONFIRM_ACCOUNT);

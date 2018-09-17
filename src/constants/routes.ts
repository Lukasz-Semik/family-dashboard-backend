export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

export const API_SIGN_UP: string = '/user/sign-up';
export const API_FULL_SIGN_UP: string = generateFullApi(API_SIGN_UP);

export const API_SIGN_IN: string = '/user/sign-in';
export const API_FULL_SIGN_IN: string = generateFullApi(API_SIGN_IN);

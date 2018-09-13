export const api: string = '/api';

export const generateFullApi: (suffix: string) => string = suffix => `${api}${suffix}`;

export const API_SIGN_UP: string = '/sign-up';
export const API_FULL_SIGN_UP: string = generateFullApi(API_SIGN_UP);

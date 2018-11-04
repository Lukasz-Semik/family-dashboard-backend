import { isEmpty } from 'lodash';
import * as validator from 'validator';

export const isBlank: (str: string) => boolean = str => (!str ? true : isEmpty(String(str).trim()));

export const isEmail: (email: string) => boolean = email =>
  isBlank(email) ? false : validator.isEmail(String(email));

export const hasProperLength: (str: string, min: number, max: number) => boolean = (
  str,
  min,
  max
) => validator.isLength(String(str), { min, max });

export const checkIsProperUpdatePayload: (payload: object, allowdDataKeys: string[]) => boolean = (
  payload,
  allowdDataKeys
) => {
  if (isEmpty(payload)) return false;

  const payloadKeys: string[] = Object.keys(payload);

  let isPayloadValid: boolean = true;

  payloadKeys.forEach(key => {
    if (!allowdDataKeys.includes(key) || isEmpty(payload[key])) isPayloadValid = false;
  });

  return isPayloadValid;
};

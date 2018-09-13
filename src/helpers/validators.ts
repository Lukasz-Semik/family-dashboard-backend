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

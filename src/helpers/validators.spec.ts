import { expect } from 'chai';

import { isBlank, isEmail, hasProperLength, checkIsProperUpdatePayload } from './validators';
import { allowedUpdateUserPayloadKeys } from '../constants/allowedPayloadKeys';

describe('isBlank()', () => {
  it('should return true for undefined', () => {
    expect(isBlank(undefined)).to.equal(true);
  });

  it('should return true for null', () => {
    expect(isBlank(null)).to.equal(true);
  });

  it('should return true for empty string', () => {
    expect(isBlank('')).to.equal(true);
  });

  it('should return false for any argument', () => {
    expect(isBlank('test')).to.equal(false);
  });
});

describe('isEmail()', () => {
  it('should return false for undefined', () => {
    expect(isEmail(undefined)).to.equal(false);
  });

  it('should return false for null', () => {
    expect(isEmail(null)).to.equal(false);
  });

  it('should return false for wrong format of email', () => {
    expect(isEmail('aaa')).to.equal(false);
    expect(isEmail('aaa.com')).to.equal(false);
    expect(isEmail('aaa@')).to.equal(false);
    expect(isEmail('aaa@com')).to.equal(false);
  });

  it('should return true for proper format of email', () => {
    expect(isEmail('aaa@gmail.com')).to.equal(true);
  });
});

describe('hasProperLength()', () => {
  it('should return true for string with proper length', () => {
    expect(hasProperLength('ssss', 1, 4)).to.equal(true);
  });

  it('should return false for not proper lengths', () => {
    expect(hasProperLength('s', 2, 4)).to.equal(false);
    expect(hasProperLength('sssssssss', 2, 4)).to.equal(false);
  });
});

describe('checkIsProperUpdatePayload()', () => {
  it('should return true for proper payload data', () => {
    expect(
      checkIsProperUpdatePayload(
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        allowedUpdateUserPayloadKeys
      )
    ).to.equal(true);
  });

  it('should return false for some empty value', () => {
    expect(
      checkIsProperUpdatePayload(
        {
          firstName: '',
          lastName: 'Doe',
        },
        allowedUpdateUserPayloadKeys
      )
    ).to.equal(false);
  });

  it('should return false for not allowed data', () => {
    expect(
      checkIsProperUpdatePayload(
        {
          firstName: 'John',
          lastName: 'Doe',
          notAllowedData: 'some-not-allowed-data',
        },
        allowedUpdateUserPayloadKeys
      )
    ).to.equal(false);
  });

  it('should return false for empty payload', () => {
    expect(checkIsProperUpdatePayload({}, allowedUpdateUserPayloadKeys)).to.equal(false);
  });
});

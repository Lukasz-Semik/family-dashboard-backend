import { expect } from 'chai';
import * as request from 'supertest';

import { validateEmail, validatePassword, checkIsProperUpdateUserPayload } from './user';
import { emailErrors, passwordErrors } from '../constants/errors';

describe('user validators', () => {
  describe('validateEmail()', () => {
    it('should return proper error msg for empty string', () => {
      expect(validateEmail('')).to.equal(emailErrors.isRequired);
    });

    it('should return proper error msg for undefined', () => {
      expect(validateEmail(undefined)).to.equal(emailErrors.isRequired);
    });

    it('should return proper error msg for wrong format', () => {
      expect(validateEmail('asddd@')).to.equal(emailErrors.wrongFormat);
    });

    it('should return empty string for proper email', () => {
      expect(validateEmail('some-name@gmail.com')).to.equal('');
    });
  });

  describe('validatePassword()', () => {
    it('should return proper error msg for empty string', () => {
      expect(validatePassword('')).to.equal(passwordErrors.isRequired);
    });

    it('should return proper error msg for undefined', () => {
      expect(validatePassword(undefined)).to.equal(passwordErrors.isRequired);
    });

    it('should return proper error msg for wrong format', () => {
      expect(validatePassword('as')).to.equal(passwordErrors.wrongFormat);
    });

    it('should return empty string for proper email', () => {
      expect(validatePassword('some-name@gmail.com')).to.equal('');
    });
  });

  describe('checkIsProperUpdateUserPayload()', () => {
    it('should return true for proper payload data', () => {
      expect(
        checkIsProperUpdateUserPayload({
          firstName: 'John',
          lastName: 'Doe',
        })
      ).to.equal(true);
    });

    it('should return true for some empty value', () => {
      expect(
        checkIsProperUpdateUserPayload({
          firstName: '',
          lastName: 'Doe',
        })
      ).to.equal(false);
    });

    it('should return true for not allowed data', () => {
      expect(
        checkIsProperUpdateUserPayload({
          firstName: 'John',
          lastName: 'Doe',
          notAllowedData: 'some-not-allowed-data',
        })
      ).to.equal(false);
    });
  });
});

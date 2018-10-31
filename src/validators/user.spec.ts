import { expect } from 'chai';

import {
  validateEmail,
  validatePassword,
  validateUserAssigningFamilyHead,
  validateUserToAssignFamilyHead,
} from './user';
import {
  emailErrors,
  userErrors,
  passwordErrors,
  defaultErrors,
  familyErrors,
} from '../constants/errors';

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

  describe('validateUserAssigningFamilyHead()', () => {
    const defaultFamily = {
      name: 'family',
      users: [{ id: 2 }],
    };

    const defaultUser = {
      id: 1,
      isFamilyHead: true,
      hasFamily: true,
      family: defaultFamily,
    };

    it('should return proper validator object if assigning id is equal to id to assigned', () => {
      expect(validateUserAssigningFamilyHead(defaultUser, 1)).to.deep.equal({
        isValid: false,
        errors: { email: userErrors.assignItself },
      });
    });

    it('should return proper validator object if user to assign id is not provided', () => {
      expect(validateUserAssigningFamilyHead(defaultUser, undefined)).to.deep.equal({
        isValid: false,
        errors: { userToAssignId: defaultErrors.isRequired },
      });
    });

    it('should return proper validator object if user is not family haed', () => {
      expect(
        validateUserAssigningFamilyHead(
          { ...defaultUser, isFamilyHead: false, family: defaultFamily },
          2
        )
      ).to.deep.equal({
        isValid: false,
        errors: { email: userErrors.isNoFamilyHead },
      });
    });

    it('should return proper validator object if user has no family', () => {
      expect(
        validateUserAssigningFamilyHead(
          { ...defaultUser, isFamilyHead: false, hasFamily: false },
          2
        )
      ).to.deep.equal({
        isValid: false,
        errors: { email: userErrors.hasNoFamily },
      });
    });

    it('should return proper validator object if everything is ok', () => {
      expect(validateUserAssigningFamilyHead(defaultUser, 2)).to.deep.equal({
        isValid: true,
        errors: {},
      });
    });
  });

  describe('validateUserToAssignFamilyHead()', () => {
    const defaultFamily = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];

    it('should return proper validator object if id does not in the family', () => {
      expect(validateUserToAssignFamilyHead(3, defaultFamily)).to.deep.equal({
        isValid: false,
        errors: { family: familyErrors.noSuchUser },
      });
    });

    it('should return proper validator object if famliy is too small', () => {
      expect(validateUserToAssignFamilyHead(2, [{ id: 1 }])).to.deep.equal({
        isValid: false,
        errors: { family: familyErrors.tooSmall },
      });
    });

    it('should return proper validator object if everything is ok', () => {
      expect(validateUserToAssignFamilyHead(2, defaultFamily)).to.deep.equal({
        isValid: true,
        errors: {},
      });
    });
  });
});

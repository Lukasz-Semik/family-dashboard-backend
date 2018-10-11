import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import { dbSeedUsers } from '../utils/testsSeeds';
import { notSeededUsers, seededUsers } from '../constants/testFixtures';
import {
  generateFullApi,
  API_USER_SIGN_UP,
  API_USER_SIGN_IN,
  API_USER_CONFIRM,
  API_USER_IS_AUTHORIZED,
  API_USER_GET_CURRENT,
  API_USER_INVITE,
  API_USER_CONFIRM_INVITED,
  API_USER_UPDATE,
  API_USER_DELETE,
} from '../constants/routes';
import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';
import { accountSuccesses } from '../constants/successes';
import { Token } from '../controllers';

before(() => dbSeedUsers());

describe('User Controller', () => {
  const confirmationAccountTokenGenerated: string = Token.create({
    email: notSeededUsers[0].email,
  });
  const invitedTokenGenerarted: string = Token.create({ email: notSeededUsers[1].email });
  const notExistingUserTokenGenerated: string = Token.create({ email: 'not-existing-user' });
  const withoutFamilyTokenGenerated: string = Token.create({ email: seededUsers[0].email });
  const withFamilyTokenGenerated: string = Token.create({ email: seededUsers[1].email });
  const withBigFamilyTokenGenerated: string = Token.create({ email: seededUsers[2].email });
  const withFamilyToRemoveTokenGenerated: string = Token.create({ email: seededUsers[3].email });

  describe(`Route ${generateFullApi(API_USER_SIGN_UP)}`, () => {
    it('should create not verified account', done => {
      const { email, password, firstName, lastName, gender, age } = notSeededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send({
          email,
          password,
          firstName,
          lastName,
          gender,
          age,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.account).to.equal(accountSuccesses.created);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error messages for empty request', done => {
      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.isRequired,
            password: passwordErrors.isRequired,
            firstName: defaultErrors.isRequired,
            lastName: defaultErrors.isRequired,
            gender: defaultErrors.notAllowedValue,
            age: defaultErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error messages for not valid request', done => {
      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send({
          email: 'ddd',
          password: 'ddd',
          gender: 'bleble',
        })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.wrongFormat,
            password: passwordErrors.wrongFormat,
            firstName: defaultErrors.isRequired,
            lastName: defaultErrors.isRequired,
            gender: defaultErrors.notAllowedValue,
            age: defaultErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for existing user', done => {
      const { email, password, firstName, lastName, age, gender } = seededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send({
          email,
          password,
          firstName,
          lastName,
          age,
          gender,
        })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.emailTaken,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_SIGN_IN)}`, () => {
    it('should return user data for proper sign in', done => {
      const { email, password } = seededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.body.isAuthorized).to.equal(true);
          expect(res.body.token).to.be.a('string');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not existing user', done => {
      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email: 'not-existing@guser.com', password: 'Password123*' })
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.notExist);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not not valid sign in data', done => {
      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email: 'some-wrong-email', password: '' })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.wrongFormat,
            password: passwordErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not not proper password', done => {
      const { email } = seededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email, password: 'SomeWrongPassword123' })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            password: passwordErrors.notValid,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not verified user', done => {
      const { email, password } = notSeededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.notVerified,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${API_USER_CONFIRM}`, () => {
    it('should confirm user', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM))
        .send({ confirmationAccountToken: confirmationAccountTokenGenerated })
        .expect(200)
        .expect(res => {
          expect(res.body.account).to.equal(accountSuccesses.confirmed);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for lack of token', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM))
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors.token).to.equal(defaultErrors.isRequired);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for lack of token', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM))
        .send({ confirmationAccountToken: notExistingUserTokenGenerated })
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.notExist);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_INVITE)}`, () => {
    it('should invite user', done => {
      const { email, firstName, lastName, age, gender } = notSeededUsers[1];

      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ email, firstName, lastName, age, gender })
        .expect(200)
        .expect(res => {
          expect(res.body).to.include({
            account: accountSuccesses.invited,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper messages for wrong data sent', done => {
      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.include({
            email: emailErrors.isRequired,
            firstName: defaultErrors.isRequired,
            lastName: defaultErrors.isRequired,
            age: defaultErrors.isRequired,
            gender: defaultErrors.notAllowedValue,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error for user without family', done => {
      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withoutFamilyTokenGenerated)
        .type('form')
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.hasNoFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error for existing user', done => {
      const { email, firstName, lastName, age, gender } = notSeededUsers[0];

      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ email, firstName, lastName, age, gender })
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.emailTaken);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${API_USER_CONFIRM_INVITED}`, () => {
    it('should confirm invited user', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM_INVITED))
        .send({ password: 'Password123', invitationToken: invitedTokenGenerarted })
        .expect(200)
        .expect(res => {
          expect(res.body.account).to.equal(accountSuccesses.confirmed);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper errors for wrong data', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM_INVITED))
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.include({
            password: passwordErrors.isRequired,
            invitationToken: defaultErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_GET_CURRENT)}`, () => {
    it('should return proper data for current user', done => {
      const { email, isFamilyHead, hasFamily, firstName, lastName, age, gender } = seededUsers[1];

      request(APP)
        .get(generateFullApi(API_USER_GET_CURRENT))
        .set('authorization', withFamilyTokenGenerated)
        .expect(200)
        .expect(res => {
          expect(res.body.currentUser).to.include({
            email,
            isFamilyHead,
            hasFamily,
            firstName,
            lastName,
            age,
            gender,
          });

          expect(res.body.currentUser.userId).to.be.a('number');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not authorized user', done => {
      request(APP)
        .get(generateFullApi(API_USER_GET_CURRENT))
        .set('authorization', notExistingUserTokenGenerated)
        .expect(401)
        .expect(res => {
          expect(res.body.name).to.equal('AuthorizationRequiredError');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_IS_AUTHORIZED)}`, () => {
    it('should return isAuthorized info', done => {
      request(APP)
        .get(generateFullApi(API_USER_IS_AUTHORIZED))
        .set('authorization', withFamilyTokenGenerated)
        .expect(200)
        .expect(res => {
          expect(res.body.isAuthorized).to.equal(true);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for some not proper token', done => {
      request(APP)
        .get(generateFullApi(API_USER_IS_AUTHORIZED))
        .set('authorization', notExistingUserTokenGenerated)
        .expect(401)
        .expect(res => {
          expect(res.body.name).to.equal('AuthorizationRequiredError');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_UPDATE)}`, () => {
    it('should return updated user', done => {
      const firstName = 'Minerva The Cat';
      const { lastName, gender, age, isFamilyHead, hasFamily, isVerified } = seededUsers[1];

      request(APP)
        .patch(generateFullApi(API_USER_UPDATE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ firstName })
        .expect(200)
        .expect(res => {
          expect(res.body.user).to.include({
            firstName,
            lastName,
            gender,
            age,
            isFamilyHead,
            hasFamily,
            isVerified,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for empty data', done => {
      request(APP)
        .patch(generateFullApi(API_USER_UPDATE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors.payload).to.equal(defaultErrors.emptyPayload);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not allowed data', done => {
      request(APP)
        .patch(generateFullApi(API_USER_UPDATE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ password: 'some-fake-password' })
        .expect(400)
        .expect(res => {
          expect(res.body.errors.payload).to.equal(defaultErrors.notAllowedValue);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_USER_DELETE)}`, () => {
    it('should delete user without family', done => {
      request(APP)
        .delete(generateFullApi(API_USER_DELETE))
        .set('authorization', withoutFamilyTokenGenerated)
        .expect(200)
        .expect(res => {
          expect(res.body.removedEmail).to.equal(seededUsers[0].email);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should delete user with family and without members', done => {
      request(APP)
        .delete(generateFullApi(API_USER_DELETE))
        .set('authorization', withFamilyToRemoveTokenGenerated)
        .expect(200)
        .expect(res => {
          const { removedEmail, removedFamily } = res.body;

          expect(removedEmail).to.equal(seededUsers[3].email);
          expect(removedFamily).to.equal(seededUsers[3].lastName);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it(`should return proper errors message after trial of delete user
      with family and with members`, done => {
      request(APP)
        .delete(generateFullApi(API_USER_DELETE))
        .set('authorization', withBigFamilyTokenGenerated)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.familyHeadNotRemovable);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});

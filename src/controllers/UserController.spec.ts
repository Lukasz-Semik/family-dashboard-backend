import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import { dbSeedTests, generatedToken } from '../utils/testsSeeds';
import { users, wrongToken } from '../constants/testFixtures';
import {
  API_FULL_SIGN_UP,
  API_FULL_SIGN_IN,
  API_FULL_IS_AUTHORIZED,
  API_FULL_GET_CURRENT_USER,
} from '../constants/routes';
import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';
import { accountSuccesses } from '../constants/successes';

before(() => dbSeedTests());

describe('User Controller', () => {
  describe(`Route ${API_FULL_SIGN_UP}`, () => {
    it('should create not verified account', done => {
      const { email, password, firstName, lastName } = users[0];

      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({
          email,
          password,
          firstName,
          lastName,
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
        .post(API_FULL_SIGN_UP)
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.isRequired,
            password: passwordErrors.isRequired,
            firstName: defaultErrors.isRequired,
            lastName: defaultErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error messages for not valid request', done => {
      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({
          email: 'ddd',
          password: 'ddd',
        })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).to.deep.equal({
            email: emailErrors.wrongFormat,
            password: passwordErrors.wrongFormat,
            firstName: defaultErrors.isRequired,
            lastName: defaultErrors.isRequired,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for existing user', done => {
      const { email, password, firstName, lastName } = users[1];

      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({
          email,
          password,
          firstName,
          lastName,
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

  describe(`Route ${API_FULL_SIGN_IN}`, () => {
    it('should return user data for proper sign in', done => {
      const { email, password } = users[1];

      request(APP)
        .post(API_FULL_SIGN_IN)
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
        .post(API_FULL_SIGN_IN)
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
        .post(API_FULL_SIGN_IN)
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
      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email: users[1].email, password: 'SomeWrongPassword123' })
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
      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email: users[3].email, password: users[3].password })
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

  describe(`Route ${API_FULL_GET_CURRENT_USER}`, () => {
    it('should return proper data for current user', done => {
      request(APP)
        .get(API_FULL_GET_CURRENT_USER)
        .set('authorization', generatedToken)
        .expect(200)
        .expect(res => {
          expect(res.body.currentUser).to.include({
            email: 'george@seed-2-signed-in.com',
            isFamilyHead: false,
            hasFamily: false,
            firstName: 'George',
            lastName: 'Seed-2-signed-in',
            age: 20,
            gender: 'male',
          });

          expect(res.body.currentUser.userId).to.be.a('number');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper message for not authorized user', done => {
      request(APP)
        .get(API_FULL_GET_CURRENT_USER)
        .set('authorization', wrongToken)
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

  describe(`Route ${API_FULL_IS_AUTHORIZED}`, () => {
    it('should return isAuthorized info', done => {
      request(APP)
        .get(API_FULL_IS_AUTHORIZED)
        .set('authorization', generatedToken)
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
        .get(API_FULL_IS_AUTHORIZED)
        .set('authorization', wrongToken)
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
});

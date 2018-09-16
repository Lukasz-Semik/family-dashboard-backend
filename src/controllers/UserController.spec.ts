import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import { dbSeedTests } from '../utils/testsSeeds';
import { API_FULL_SIGN_UP } from '../constants/routes';
import { users } from '../constants/textFixtures';
import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';

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
          expect(res.body).to.include({
            email,
            password,
            firstName,
            lastName,
            isVerified: false,
          });

          expect(res.body.createdAt).to.be.a('string');
          expect(res.body.createdAt).to.equal(res.body.updatedAt);
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
});

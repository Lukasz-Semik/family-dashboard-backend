import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import {
  dbSeedTests,
  familyCreatorGeneratedToken,
  familyOwnerGeneratedToken,
} from '../utils/testsSeeds';
import { users, wrongToken } from '../constants/testFixtures';
import { API_FULL_CREATE_FAMILY, API_FULL_GET_FAMILY } from '../constants/routes';
import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';
import { accountSuccesses } from '../constants/successes';

describe('Family Controller', () => {
  describe(`Route ${API_FULL_CREATE_FAMILY}`, () => {
    it('should create and return family for signed in user[4]', done => {
      request(APP)
        .post(API_FULL_CREATE_FAMILY)
        .set('authorization', familyCreatorGeneratedToken)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

          expect(name).to.equal(users[4].lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);

          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: false,
            firstName: users[4].firstName,
            lastName: users[4].lastName,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${API_FULL_GET_FAMILY}`, () => {
    it('should return family for signed in user[5]', done => {
      request(APP)
        .get(API_FULL_GET_FAMILY)
        .set('authorization', familyOwnerGeneratedToken)
        // .expect(200)
        .expect(res => {
          console.log(res.body);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});

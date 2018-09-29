import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import {
  familyCreatorGeneratedToken,
  generatedToken,
  familyOwnerGeneratedToken,
} from '../utils/testsSeeds';
import { users } from '../constants/testFixtures';
import { generateFullApi, API_GET_FAMILY, API_CREATE_FAMILY } from '../constants/routes';
import { emailErrors } from '../constants/errors';

describe('Family Controller', () => {
  describe(`Route ${generateFullApi(API_CREATE_FAMILY)}`, () => {
    it('should create and return family for signed in user[4]', done => {
      request(APP)
        .post(generateFullApi(API_CREATE_FAMILY))
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
            isFamilyHead: true,
            firstName: users[4].firstName,
            lastName: users[4].lastName,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message if user has family', done => {
      request(APP)
        .post(generateFullApi(API_CREATE_FAMILY))
        .set('authorization', familyCreatorGeneratedToken)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.hasFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_GET_FAMILY)}`, () => {
    it('should return family for signed in user[5]', done => {
      request(APP)
        .get(generateFullApi(API_GET_FAMILY))
        .set('authorization', familyOwnerGeneratedToken)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

          expect(name).to.equal(users[5].lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);

          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: true,
            isVerified: true,
            firstName: users[5].firstName,
            lastName: users[5].lastName,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error for signed in user[0], without family', done => {
      request(APP)
        .get(generateFullApi(API_GET_FAMILY))
        .set('authorization', generatedToken)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.email).to.equal(emailErrors.hasNoFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});

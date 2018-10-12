import { expect } from 'chai';
import * as request from 'supertest';

import { APP } from '../server';
import { seededUsers } from '../constants/testFixtures';
import { generateFullApi, API_FAMILY_GET, API_FAMILY_CREATE } from '../constants/routes';
import { emailErrors } from '../constants/errors';
import { Token } from '../controllers';

describe('Family Controller', async () => {
  const familyCreatorTokenGenerated: string = await Token.create({ email: seededUsers[4].email });
  const familyOwnerTokenGenerated: string = await Token.create({ email: seededUsers[2].email });
  const withoutFamilyTokenGenerated: string = await Token.create({ email: seededUsers[5].email });

  describe(`Route ${generateFullApi(API_FAMILY_CREATE)}`, () => {
    it('should create and return family for signed in user', done => {
      request(APP)
        .post(generateFullApi(API_FAMILY_CREATE))
        .set('authorization', familyCreatorTokenGenerated)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;
          expect(name).to.equal(seededUsers[4].lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);
          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: true,
            firstName: seededUsers[4].firstName,
            lastName: seededUsers[4].lastName,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message if user has family', done => {
      request(APP)
        .post(generateFullApi(API_FAMILY_CREATE))
        .set('authorization', familyOwnerTokenGenerated)
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

  describe(`Route ${generateFullApi(API_FAMILY_GET)}`, () => {
    it('should return family', done => {
      request(APP)
        .get(generateFullApi(API_FAMILY_GET))
        .set('authorization', familyCreatorTokenGenerated)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

          expect(name).to.equal(seededUsers[4].lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);

          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: true,
            isVerified: true,
            firstName: seededUsers[4].firstName,
            lastName: seededUsers[4].lastName,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error for signed in user, without family', done => {
      request(APP)
        .get(generateFullApi(API_FAMILY_GET))
        .set('authorization', withoutFamilyTokenGenerated)
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

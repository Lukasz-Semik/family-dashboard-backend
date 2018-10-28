import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUser, dbClear } from '../utils/testsSeeds';
import {
  generateFullApi,
  API_FAMILY_GET,
  API_FAMILY_CREATE,
  API_FAMILY_ASSIGN_HEAD,
} from '../constants/routes';
import { userErrors } from '../constants/errors';
import { Token } from '../controllers';
import { accountSuccesses } from '../constants/successes';

describe('Family Controller', async () => {
  let connection = null;

  before(async () => {
    connection = await createConnection();
  });

  after(async () => {
    connection.close();
  });

  describe(`Route ${generateFullApi(API_FAMILY_CREATE)}`, () => {
    let fmailyCreatorUser: any;
    let familyCreatorTokenGenerated: string;
    const familyCreatorEmail: string = 'family-creator@email.com';

    let seededFamily: any;
    let familyOwnerTokenGenerated: string;
    const familyOwnerEmail: string = 'family-owner-user@email.com';

    before(async () => {
      await dbClear(connection);

      fmailyCreatorUser = await dbSeedUser({ email: familyCreatorEmail });

      familyCreatorTokenGenerated = await Token.create({
        email: familyCreatorEmail,
        id: fmailyCreatorUser.id,
      });

      seededFamily = await dbSeedUser({
        email: familyOwnerEmail,
        hasFamily: true,
        isFamilyHead: true,
      });

      familyOwnerTokenGenerated = await Token.create({
        email: familyOwnerEmail,
        id: seededFamily.familyHead.id,
      });
    });

    after(async () => await dbClear(connection));

    it('should create and return family for signed in user', done => {
      request(APP)
        .post(generateFullApi(API_FAMILY_CREATE))
        .set('authorization', familyCreatorTokenGenerated)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

          expect(name).to.equal(fmailyCreatorUser.lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);
          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: true,
            firstName: fmailyCreatorUser.firstName,
            lastName: fmailyCreatorUser.lastName,
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
          expect(res.body.errors.email).to.equal(userErrors.hasFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_FAMILY_GET)}`, () => {
    let withoutFamilyUser: any;
    let withoutFamilyTokenGenerated: string;
    const withoutFamilyEmail: string = 'without-family-user@email.com';

    let family: any;
    let familyOwnerTokenGenerated: string;
    const familyOwnerEmail: string = 'family-owner-user@email.com';

    before(async () => {
      await dbClear(connection);

      family = await dbSeedUser({
        email: familyOwnerEmail,
        hasFamily: true,
        isFamilyHead: true,
        isVerified: true,
      });

      familyOwnerTokenGenerated = await Token.create({
        email: familyOwnerEmail,
        id: family.familyHead.id,
      });

      withoutFamilyUser = await dbSeedUser({
        email: withoutFamilyEmail,
      });

      withoutFamilyTokenGenerated = await Token.create({
        email: withoutFamilyEmail,
        id: withoutFamilyUser.id,
      });
    });

    after(async () => await dbClear(connection));

    it('should return family', done => {
      request(APP)
        .get(generateFullApi(API_FAMILY_GET))
        .set('authorization', familyOwnerTokenGenerated)
        .expect(200)
        .expect(res => {
          const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

          expect(name).to.equal(family.familyHead.lastName);
          expect(id).to.be.a('number');
          expect(createdAt).to.be.a('string');
          expect(createdAt).to.equal(updatedAt);

          expect(familyUsers.length).to.equal(1);
          expect(familyUsers[0]).to.include({
            isFamilyHead: true,
            isVerified: true,
            firstName: family.familyHead.firstName,
            lastName: family.familyHead.lastName,
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
          expect(res.body.errors.email).to.equal(userErrors.hasNoFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`Route ${generateFullApi(API_FAMILY_ASSIGN_HEAD)}`, () => {
    let family: any;
    let familyOwnerTokenGenerated: string;
    const familyOwnerEmail: string = 'family-owner-user@email.com';

    before(async () => {
      family = await dbSeedUser({
        email: familyOwnerEmail,
        hasFamily: true,
        isFamilyHead: true,
        isVerified: true,
        hasBigFamily: true,
      });

      familyOwnerTokenGenerated = await Token.create({
        email: familyOwnerEmail,
        id: family.familyHead.id,
      });
    });

    after(async () => await dbClear(connection));

    it('should reassign family head', done => {
      request(APP)
        .patch(generateFullApi(API_FAMILY_ASSIGN_HEAD))
        .set('authorization', familyOwnerTokenGenerated)
        .type('form')
        .send({ userToAssignId: family.familyMember.id })
        .expect(200)
        .expect(res => {
          expect(res.body.family).to.equal(accountSuccesses.familyHeadAssigned);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});

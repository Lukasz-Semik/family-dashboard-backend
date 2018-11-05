import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUser, dbSeedFamily, dbClear } from '../utils/testsSeeds';
import { generateUser, defaultPassword } from '../constants/testFixtures';
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
import { emailErrors, userErrors, passwordErrors, defaultErrors } from '../constants/errors';
import { accountSuccesses } from '../constants/successes';
import { Token } from '../controllers';
import { RES_CONFLICT } from '../constants/resStatuses';

describe('User Controller', () => {
  let connection = null;

  before(async () => {
    connection = await createConnection();
  });

  after(async () => {
    connection.close();
  });

  describe(`Route ${generateFullApi(API_USER_SIGN_UP)}`, () => {
    let existingUser: any;

    before(async () => {
      await dbClear(connection);

      existingUser = await dbSeedUser({ email: 'existing-user@email.com' });
    });

    after(async () => await dbClear(connection));

    it('should create not verified account', done => {
      const { email, password, firstName, lastName, gender, birthDate } = generateUser({});

      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send({
          email,
          password,
          firstName,
          lastName,
          gender,
          birthDate,
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
            birthDate: defaultErrors.notAllowedValue,
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
            birthDate: defaultErrors.notAllowedValue,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for existing user', done => {
      const { email, firstName, lastName, birthDate, gender } = existingUser;

      request(APP)
        .post(generateFullApi(API_USER_SIGN_UP))
        .send({
          password: defaultPassword,
          email,
          firstName,
          lastName,
          birthDate,
          gender,
        })
        .expect(409)
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
    let verifiedUser: any;
    let notVerifiedUser: any;

    before(async () => {
      verifiedUser = await dbSeedUser({ email: 'verified-user@email.com', isVerified: true });
      notVerifiedUser = await dbSeedUser({ email: 'not-verified-user@email.com' });
    });

    after(async () => await dbClear(connection));

    it('should return user data for proper sign in', done => {
      const { email } = verifiedUser;

      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email, password: defaultPassword })
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
        .send({ email: 'not-existing@guser.com', password: defaultPassword })
        .expect(404)
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
      const { email } = verifiedUser;

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
      const { email } = notVerifiedUser;

      request(APP)
        .post(generateFullApi(API_USER_SIGN_IN))
        .send({ email, password: defaultPassword })
        .expect(422)
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
    let confirmationAccountTokenGenerated: string;
    let notExistingUserTokenGenerated: string;

    const notVerifiedEmail: string = 'not-verified-user@email.com';

    before(async () => {
      await dbSeedUser({ email: notVerifiedEmail });
      confirmationAccountTokenGenerated = await Token.create({ email: notVerifiedEmail });
      notExistingUserTokenGenerated = await Token.create({ email: 'not-existing-user@email.com' });
    });

    after(async () => await dbClear(connection));

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

    it('should return proper error message for not existing user', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM))
        .send({ confirmationAccountToken: notExistingUserTokenGenerated })
        .expect(404)
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
    let family: any;
    let withFamilyTokenGenerated: string;
    const withFamilyEmail: string = 'with-family-user@email.com';

    let withoutFamilyUser: any;
    let withoutFamilyTokenGenerated: string;
    const withoutFamilyEmail: string = 'without-family-user@email.com';

    before(async () => {
      family = await dbSeedFamily({
        familyHeadEmail: withFamilyEmail,
        hasFamily: true,
        isFamilyHead: true,
        isVerified: true,
      });

      withFamilyTokenGenerated = await Token.create({
        email: withFamilyEmail,
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

    it('should invite user', done => {
      const { email, firstName, lastName, birthDate, gender } = generateUser({
        email: 'invited-user@email.com',
      });

      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ email, firstName, lastName, birthDate, gender })
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
            birthDate: defaultErrors.notAllowedValue,
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
        .expect(422)
        .expect(res => {
          expect(res.body.errors.email).to.equal(userErrors.hasNoFamily);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error for existing user', done => {
      const { email, firstName, lastName, birthDate, gender } = family.familyHead;

      request(APP)
        .post(generateFullApi(API_USER_INVITE))
        .set('authorization', withFamilyTokenGenerated)
        .type('form')
        .send({ email, firstName, lastName, birthDate, gender })
        .expect(409)
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
    let invitedTokenGenerarted: string;
    const invitedEmail: string = 'invited-user@email.com';

    before(async () => {
      await dbSeedUser({
        email: invitedEmail,
        hasFamily: true,
        isFamilyHead: true,
        isVerified: true,
      });

      invitedTokenGenerarted = await Token.create({ email: invitedEmail });
    });

    after(async () => await dbClear(connection));

    it('should confirm invited user', done => {
      request(APP)
        .post(generateFullApi(API_USER_CONFIRM_INVITED))
        .send({ password: defaultPassword, invitationToken: invitedTokenGenerarted })
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

  describe('Current user routes', () => {
    let existingUser: any;
    let existingUserTokenGenerated: string;
    const existingUserEmal: string = 'existing-user@email.com';

    let notExistingUserTokenGenerated: string;

    before(async () => {
      existingUser = await dbSeedUser({ email: existingUserEmal });

      existingUserTokenGenerated = await Token.create({
        email: existingUserEmal,
        id: existingUser.id,
      });

      notExistingUserTokenGenerated = await Token.create({
        email: 'not-existing-user@email.com',
        id: 999,
      });
    });

    after(async () => await dbClear(connection));

    describe(`Route ${generateFullApi(API_USER_GET_CURRENT)}`, () => {
      it('should return proper data for current user', done => {
        const {
          email,
          isFamilyHead,
          hasFamily,
          firstName,
          lastName,
          birthDate,
          gender,
        } = existingUser;

        request(APP)
          .get(generateFullApi(API_USER_GET_CURRENT))
          .set('authorization', existingUserTokenGenerated)
          .expect(200)
          .expect(res => {
            expect(res.body.currentUser).to.include({
              email,
              isFamilyHead,
              hasFamily,
              firstName,
              lastName,
              birthDate,
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
          .set('authorization', existingUserTokenGenerated)
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
  });

  describe(`Route ${generateFullApi(API_USER_UPDATE)}`, () => {
    let existingUser: any;
    let existingUserTokenGenerated: string;
    const existingUserEmal: string = 'existing-user@email.com';

    before(async () => {
      existingUser = await dbSeedUser({ email: existingUserEmal });

      existingUserTokenGenerated = await Token.create({
        email: existingUserEmal,
        id: existingUser.id,
      });
    });

    after(async () => await dbClear(connection));

    it('should return updated user', done => {
      const firstName = 'George';
      const { lastName, gender, birthDate, isFamilyHead, hasFamily, isVerified } = existingUser;

      request(APP)
        .patch(generateFullApi(API_USER_UPDATE))
        .set('authorization', existingUserTokenGenerated)
        .type('form')
        .send({ firstName })
        .expect(200)
        .expect(res => {
          expect(res.body.user).to.include({
            firstName,
            lastName,
            gender,
            birthDate,
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
        .set('authorization', existingUserTokenGenerated)
        .type('form')
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors.payload).to.equal(defaultErrors.notAllowedValue);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should return proper error message for not allowed data', done => {
      request(APP)
        .patch(generateFullApi(API_USER_UPDATE))
        .set('authorization', existingUserTokenGenerated)
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
    let existingUser: any;
    let existingUserTokenGenerated: string;
    const existingUserEmal: string = 'existing-user@email.com';

    let family: any;
    let withFamilyTokenGenerated: string;
    const withFamilyEmail: string = 'with-family-user@email.com';

    let bigFamily: any;
    let withBigFamilyTokenGenerated: string;
    const withBigFamilyEmail: string = 'with-big-family-user@email.com';

    before(async () => {
      existingUser = await dbSeedUser({ email: existingUserEmal });

      existingUserTokenGenerated = await Token.create({
        email: existingUserEmal,
        id: existingUser.id,
      });

      family = await dbSeedFamily({
        familyHeadEmail: withFamilyEmail,
      });

      withFamilyTokenGenerated = await Token.create({
        email: withFamilyEmail,
        id: family.familyHead.id,
      });

      bigFamily = await dbSeedFamily({
        familyHeadEmail: withBigFamilyEmail,
        hasBigFamily: true,
      });

      withBigFamilyTokenGenerated = await Token.create({
        email: withBigFamilyEmail,
        id: bigFamily.familyHead.id,
      });
    });

    after(async () => await dbClear(connection));

    it('should delete user without family', done => {
      request(APP)
        .delete(generateFullApi(API_USER_DELETE))
        .set('authorization', existingUserTokenGenerated)
        .expect(200)
        .expect(res => {
          expect(res.body.removedEmail).to.equal(existingUser.email);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('should delete user with family and without members', done => {
      request(APP)
        .delete(generateFullApi(API_USER_DELETE))
        .set('authorization', withFamilyTokenGenerated)
        .expect(200)
        .expect(res => {
          const { removedEmail, removedFamily } = res.body;

          expect(removedEmail).to.equal(family.familyHead.email);
          expect(removedFamily).to.equal(family.familyHead.lastName);
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
        .expect(422)
        .expect(res => {
          expect(res.body.errors.email).to.equal(userErrors.familyHeadNotRemovable);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});

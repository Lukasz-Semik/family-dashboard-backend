// import { expect } from 'chai';
// import * as request from 'supertest';

// import { APP } from '../server';
// import {
//   dbSeedTests,
//   generatedToken,
//   familyOwnerGeneratedToken,
//   invitationGeneratedToken,
//   editGeneratedToken,
// } from '../utils/testsSeeds';
// import { notSeededUsers, wrongToken } from '../constants/testFixtures';
// import {
//   generateFullApi,
//   API_USER_SIGN_UP,
//   API_USER_SIGN_IN,
//   API_USER_IS_AUTHORIZED,
//   API_USER_GET_CURRENT,
//   API_USER_INVITE,
//   API_USER_CONFIRM_INVITED,
//   API_USER_UPDATE,
// } from '../constants/routes';
// import { emailErrors, passwordErrors, defaultErrors } from '../constants/errors';
// import { accountSuccesses } from '../constants/successes';

// before(() => dbSeedTests());

// describe('User Controller', () => {
//   // describe(`Route ${generateFullApi(API_USER_SIGN_UP)}`, () => {
//   //   it('should create not verified account', done => {
//   //     const { email, password, firstName, lastName, gender, age } = users[0];

//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_UP))
//   //       .send({
//   //         email,
//   //         password,
//   //         firstName,
//   //         lastName,
//   //         gender,
//   //         age,
//   //       })
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.account).to.equal(accountSuccesses.created);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error messages for empty request', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_UP))
//   //       .send()
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           email: emailErrors.isRequired,
//   //           password: passwordErrors.isRequired,
//   //           firstName: defaultErrors.isRequired,
//   //           lastName: defaultErrors.isRequired,
//   //           gender: defaultErrors.notAllowedValue,
//   //           age: defaultErrors.isRequired,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error messages for not valid request', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_UP))
//   //       .send({
//   //         email: 'ddd',
//   //         password: 'ddd',
//   //         gender: 'bleble',
//   //       })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           email: emailErrors.wrongFormat,
//   //           password: passwordErrors.wrongFormat,
//   //           firstName: defaultErrors.isRequired,
//   //           lastName: defaultErrors.isRequired,
//   //           gender: defaultErrors.notAllowedValue,
//   //           age: defaultErrors.isRequired,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for existing user', done => {
//   //     const { email, password, firstName, lastName, age, gender } = users[1];

//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_UP))
//   //       .send({
//   //         email,
//   //         password,
//   //         firstName,
//   //         lastName,
//   //         age,
//   //         gender,
//   //       })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           email: emailErrors.emailTaken,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${generateFullApi(API_USER_UPDATE)}`, () => {
//   //   it('should return updated user', done => {
//   //     const firstName = 'Harry Junior';
//   //     const { lastName, gender, age, isFamilyHead, hasFamily, isVerified } = users[8];

//   //     request(APP)
//   //       .patch(generateFullApi(API_USER_UPDATE))
//   //       .set('authorization', editGeneratedToken)
//   //       .type('form')
//   //       .send({ firstName })
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.user).to.include({
//   //           firstName,
//   //           lastName,
//   //           gender,
//   //           age,
//   //           isFamilyHead,
//   //           hasFamily,
//   //           isVerified,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error for empty data', done => {
//   //     request(APP)
//   //       .patch(generateFullApi(API_USER_UPDATE))
//   //       .set('authorization', editGeneratedToken)
//   //       .type('form')
//   //       .send()
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors.payload).to.equal(defaultErrors.emptyPayload);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error for not allowed data', done => {
//   //     request(APP)
//   //       .patch(generateFullApi(API_USER_UPDATE))
//   //       .set('authorization', editGeneratedToken)
//   //       .type('form')
//   //       .send({ password: 'some-fake-password' })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors.payload).to.equal(defaultErrors.notAllowedValue);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${generateFullApi(API_USER_SIGN_IN)}`, () => {
//   //   it('should return user data for proper sign in', done => {
//   //     const { email, password } = users[1];

//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_IN))
//   //       .send({ email, password })
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.isAuthorized).to.equal(true);
//   //         expect(res.body.token).to.be.a('string');
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for not existing user', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_IN))
//   //       .send({ email: 'not-existing@guser.com', password: 'Password123*' })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors.email).to.equal(emailErrors.notExist);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for not not valid sign in data', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_IN))
//   //       .send({ email: 'some-wrong-email', password: '' })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           email: emailErrors.wrongFormat,
//   //           password: passwordErrors.isRequired,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for not not proper password', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_IN))
//   //       .send({ email: users[1].email, password: 'SomeWrongPassword123' })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           password: passwordErrors.notValid,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for not verified user', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_SIGN_IN))
//   //       .send({ email: users[3].email, password: users[3].password })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.deep.equal({
//   //           email: emailErrors.notVerified,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${generateFullApi(API_USER_GET_CURRENT)}`, () => {
//   //   it('should return proper data for current user', done => {
//   //     request(APP)
//   //       .get(generateFullApi(API_USER_GET_CURRENT))
//   //       .set('authorization', generatedToken)
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.currentUser).to.include({
//   //           email: 'george@seed-2-signed-in.com',
//   //           isFamilyHead: false,
//   //           hasFamily: false,
//   //           firstName: 'George',
//   //           lastName: 'Seed-2-signed-in',
//   //           age: 20,
//   //           gender: 'male',
//   //         });

//   //         expect(res.body.currentUser.userId).to.be.a('number');
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper message for not authorized user', done => {
//   //     request(APP)
//   //       .get(generateFullApi(API_USER_GET_CURRENT))
//   //       .set('authorization', wrongToken)
//   //       .expect(401)
//   //       .expect(res => {
//   //         expect(res.body.name).to.equal('AuthorizationRequiredError');
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${generateFullApi(API_USER_IS_AUTHORIZED)}`, () => {
//   //   it('should return isAuthorized info', done => {
//   //     request(APP)
//   //       .get(generateFullApi(API_USER_IS_AUTHORIZED))
//   //       .set('authorization', generatedToken)
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.isAuthorized).to.equal(true);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error message for some not proper token', done => {
//   //     request(APP)
//   //       .get(generateFullApi(API_USER_IS_AUTHORIZED))
//   //       .set('authorization', wrongToken)
//   //       .expect(401)
//   //       .expect(res => {
//   //         expect(res.body.name).to.equal('AuthorizationRequiredError');
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${API_USER_INVITE}`, () => {
//   //   it('should invite user', done => {
//   //     const { email, firstName, lastName, age, gender } = users[6];

//   //     request(APP)
//   //       .post(generateFullApi(API_USER_INVITE))
//   //       .set('authorization', familyOwnerGeneratedToken)
//   //       .type('form')
//   //       .send({ email, firstName, lastName, age, gender })
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body).to.include({
//   //           account: accountSuccesses.invited,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper messages for wrong data sent', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_INVITE))
//   //       .set('authorization', familyOwnerGeneratedToken)
//   //       .type('form')
//   //       .send()
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.include({
//   //           email: emailErrors.isRequired,
//   //           firstName: defaultErrors.isRequired,
//   //           lastName: defaultErrors.isRequired,
//   //           age: defaultErrors.isRequired,
//   //           gender: defaultErrors.notAllowedValue,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error for user without family', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_INVITE))
//   //       .set('authorization', generatedToken)
//   //       .type('form')
//   //       .send()
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors.email).to.equal(emailErrors.hasNoFamily);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper error for existing user', done => {
//   //     const { email, firstName, lastName, age, gender } = users[2];

//   //     request(APP)
//   //       .post(generateFullApi(API_USER_INVITE))
//   //       .set('authorization', familyOwnerGeneratedToken)
//   //       .type('form')
//   //       .send({ email, firstName, lastName, age, gender })
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors.email).to.equal(emailErrors.emailTaken);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });

//   // describe(`Route ${API_USER_CONFIRM_INVITED}`, () => {
//   //   it('should confirm invited user', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_CONFIRM_INVITED))
//   //       .send({ password: 'Password123', invitationToken: invitationGeneratedToken })
//   //       .expect(200)
//   //       .expect(res => {
//   //         expect(res.body.account).to.equal(accountSuccesses.confirmed);
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });

//   //   it('should return proper errors for wrong data', done => {
//   //     request(APP)
//   //       .post(generateFullApi(API_USER_CONFIRM_INVITED))
//   //       .send()
//   //       .expect(400)
//   //       .expect(res => {
//   //         expect(res.body.errors).to.include({
//   //           password: passwordErrors.isRequired,
//   //           invitationToken: defaultErrors.isRequired,
//   //         });
//   //       })
//   //       .end(err => {
//   //         if (err) return done(err);
//   //         done();
//   //       });
//   //   });
//   // });
// });

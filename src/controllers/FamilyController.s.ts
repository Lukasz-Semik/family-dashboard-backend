// import { expect } from 'chai';
// import * as request from 'supertest';

// import { APP } from '../server';
// import {
//   familyCreatorTokenGenerated,
//   toFailDeleteWithFamilyTokenGenerated,
//   notDeletedSignedInTokenGenerated,
// } from '../utils/testsSeeds';
// import { seededUsers } from '../constants/testFixtures';
// import { generateFullApi, API_FAMILY_GET, API_FAMILY_CREATE } from '../constants/routes';
// import { emailErrors } from '../constants/errors';

// describe('Family Controller', () => {
//   describe(`Route ${generateFullApi(API_FAMILY_CREATE)}`, () => {
//     it('should create and return family for signed in user[4]', done => {
//       request(APP)
//         .post(generateFullApi(API_FAMILY_CREATE))
//         .set('authorization', familyCreatorTokenGenerated)
//         .expect(200)
//         .expect(res => {
//           const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

//           expect(name).to.equal(seededUsers[6].lastName);
//           expect(id).to.be.a('number');
//           expect(createdAt).to.be.a('string');
//           expect(createdAt).to.equal(updatedAt);

//           expect(familyUsers.length).to.equal(1);
//           expect(familyUsers[0]).to.include({
//             isFamilyHead: true,
//             firstName: seededUsers[6].firstName,
//             lastName: seededUsers[6].lastName,
//           });
//         })
//         .end(err => {
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return proper error message if user has family', done => {
//       request(APP)
//         .post(generateFullApi(API_FAMILY_CREATE))
//         .set('authorization', toFailDeleteWithFamilyTokenGenerated)
//         .expect(400)
//         .expect(res => {
//           expect(res.body.errors.email).to.equal(emailErrors.hasFamily);
//         })
//         .end(err => {
//           if (err) return done(err);
//           done();
//         });
//     });
//   });

//   describe(`Route ${generateFullApi(API_FAMILY_GET)}`, () => {
//     it('should return family', done => {
//       request(APP)
//         .get(generateFullApi(API_FAMILY_GET))
//         .set('authorization', familyCreatorTokenGenerated)
//         .expect(200)
//         .expect(res => {
//           const { name, id, createdAt, updatedAt, users: familyUsers } = res.body.family;

//           expect(name).to.equal(seededUsers[6].lastName);
//           expect(id).to.be.a('number');
//           expect(createdAt).to.be.a('string');
//           expect(createdAt).to.equal(updatedAt);

//           expect(familyUsers.length).to.equal(1);
//           expect(familyUsers[0]).to.include({
//             isFamilyHead: true,
//             isVerified: true,
//             firstName: seededUsers[6].firstName,
//             lastName: seededUsers[6].lastName,
//           });
//         })
//         .end(err => {
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return proper error for signed in user[0], without family', done => {
//       request(APP)
//         .get(generateFullApi(API_FAMILY_GET))
//         .set('authorization', notDeletedSignedInTokenGenerated)
//         .expect(400)
//         .expect(res => {
//           expect(res.body.errors.email).to.equal(emailErrors.hasNoFamily);
//         })
//         .end(err => {
//           if (err) return done(err);
//           done();
//         });
//     });
//   });
// });

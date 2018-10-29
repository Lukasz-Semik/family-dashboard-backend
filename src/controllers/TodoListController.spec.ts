import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUsers, dbClear } from '../utils/testsSeeds';
import { generateFullApi, API_TODOLISTS, API_TODOLIST } from '../constants/routes';
import { todoListSuccesses } from '../constants/successes';
import { userErrors, defaultErrors } from '../constants/errors';
import { Token } from '../controllers';

describe('TodoList Controller', async () => {
  let connection = null;

  before(async () => {
    connection = await createConnection();
  });

  after(async () => {
    connection.close();
  });

  describe(`Route ${generateFullApi(API_TODOLISTS)}`, () => {
    describe('POST method', () => {
      let family: any;
      let userTokenGenerated: string;
      const userEmail: string = 'user@email.com';

      let notVerifiedUsers: any;
      let notVerifiedUserTokenGenerated: string;
      const notVerifiedEmail: string = 'not-verified-user@email.com';

      before(async () => {
        await dbClear(connection);

        family = await dbSeedUsers({
          email: userEmail,
          hasFamily: true,
          isFamilyHead: true,
          isVerified: true,
        });

        userTokenGenerated = await Token.create({
          email: userEmail,
          id: family.firstUser.id,
        });

        notVerifiedUsers = await dbSeedUsers({
          email: notVerifiedEmail,
        });

        notVerifiedUserTokenGenerated = await Token.create({
          email: notVerifiedEmail,
          id: notVerifiedUsers.firstUser.id,
        });
      });

      after(async () => await dbClear(connection));

      it('should create TodoList if only title is provided', done => {
        request(APP)
          .post(generateFullApi(API_TODOLISTS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({ title: 'some-todo-list-title' })
          .expect(200)
          .expect(res => {
            expect(res.body.todoList).to.equal(todoListSuccesses.todoListCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should create TodoList if full payload is provided', done => {
        request(APP)
          .post(generateFullApi(API_TODOLISTS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({
            title: 'some-todo-list-title',
            description: 'some-description',
            deadline: 'some-deadline',
          })
          .expect(200)
          .expect(res => {
            expect(res.body.todoList).to.equal(todoListSuccesses.todoListCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not valid payload', done => {
        request(APP)
          .post(generateFullApi(API_TODOLISTS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send()
          .expect(400)
          .expect(res => {
            expect(res.body.errors.title).to.equal(defaultErrors.isRequired);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .post(generateFullApi(API_TODOLISTS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .type('form')
          .send({ title: 'some-todo-list-title' })
          .expect(400)
          .expect(res => {
            expect(res.body.errors.user).to.equal(userErrors.hasNoPermissions);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('GET method', () => {
      let family: any;
      let userTokenGenerated: string;
      const userEmail: string = 'user@email.com';

      let notVerifiedUsers: any;
      let notVerifiedUserTokenGenerated: string;
      const notVerifiedEmail: string = 'not-verified-user@email.com';

      before(async () => {
        await dbClear(connection);

        family = await dbSeedUsers({
          email: userEmail,
          hasFamily: true,
          isFamilyHead: true,
          isVerified: true,
          hasTodoList: true,
        });

        userTokenGenerated = await Token.create({
          email: userEmail,
          id: family.firstUser.id,
        });

        notVerifiedUsers = await dbSeedUsers({
          email: notVerifiedEmail,
        });

        notVerifiedUserTokenGenerated = await Token.create({
          email: notVerifiedEmail,
          id: notVerifiedUsers.firstUser.id,
        });
      });

      it('should return todoLists', done => {
        request(APP)
          .get(generateFullApi(API_TODOLISTS))
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { todoLists } = res.body;

            expect(todoLists.length).to.equal(1);
            expect(todoLists[0].title).to.equal('some-todo-list-title');
            expect(todoLists[0].description).to.equal('some-todo-list-description');
            expect(todoLists[0].createdAt).to.be.a('string');
            expect(todoLists[0].author.id).to.equal(family.firstUser.id);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .get(generateFullApi(API_TODOLISTS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .expect(400)
          .expect(res => {
            expect(res.body.errors.user).to.equal(userErrors.hasNoPermissions);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  // describe(`Route ${API_TODOLIST().base}`, () => {
  //   let family: any;
  //   let userTokenGenerated: string;
  //   const userEmail: string = 'user@email.com';

  //   let notVerifiedUsers: any;
  //   let notVerifiedUserTokenGenerated: string;
  //   const notVerifiedEmail: string = 'not-verified-user@email.com';

  //   before(async () => {
  //     await dbClear(connection);

  //     family = await dbSeedUsers({
  //       email: userEmail,
  //       hasFamily: true,
  //       isFamilyHead: true,
  //       isVerified: true,
  //       hasTodoList: true,
  //     });

  //     userTokenGenerated = await Token.create({
  //       email: userEmail,
  //       id: family.firstUser.id,
  //     });

  //     notVerifiedUsers = await dbSeedUsers({
  //       email: notVerifiedEmail,
  //     });

  //     notVerifiedUserTokenGenerated = await Token.create({
  //       email: notVerifiedEmail,
  //       id: notVerifiedUsers.firstUser.id,
  //     });
  //   });

  //   describe('GET method', () => {
  //     it('should return specific todo-list', done => {
  //       request(APP)
  //         .get(generateFullApi(API_TODOLIST(1).fullRoute))
  //         .set('authorization', userTokenGenerated)
  //         .expect(200)
  //         .expect(res => {
  //           // expect(res.body.errors.user).to.equal(userErrors.hasNoPermissions);
  //           console.log(res.body);
  //         })
  //         .end(err => {
  //           if (err) return done(err);
  //           done();
  //         });
  //     });
  //   });
  // });
});

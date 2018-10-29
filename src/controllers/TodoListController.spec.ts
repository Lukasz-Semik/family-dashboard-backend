import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUser, dbSeedFamily, dbClear } from '../utils/testsSeeds';
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

      let notVerifiedUser: any;
      let notVerifiedUserTokenGenerated: string;
      const notVerifiedEmail: string = 'not-verified-user@email.com';

      before(async () => {
        await dbClear(connection);

        family = await dbSeedFamily({
          familyHeadEmail: userEmail,
        });

        userTokenGenerated = await Token.create({
          email: userEmail,
          id: family.familyHead.id,
        });

        notVerifiedUser = await dbSeedUser({
          email: notVerifiedEmail,
        });

        notVerifiedUserTokenGenerated = await Token.create({
          email: notVerifiedEmail,
          id: notVerifiedUser.id,
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
      const userEmail: string = 'user-1@email.com';

      let notVerifiedUser: any;
      let notVerifiedUserTokenGenerated: string;
      const notVerifiedEmail: string = 'not-verified-user@email.com';

      before(async () => {
        await dbClear(connection);

        family = await dbSeedFamily({
          familyHeadEmail: userEmail,
          hasTodoList: true,
        });

        userTokenGenerated = await Token.create({
          email: userEmail,
          id: family.familyHead.id,
        });

        notVerifiedUser = await dbSeedUser({
          email: notVerifiedEmail,
        });

        notVerifiedUserTokenGenerated = await Token.create({
          email: notVerifiedEmail,
          id: notVerifiedUser.id,
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
            expect(todoLists[0].author.id).to.equal(family.familyHead.id);
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

  describe(`Route ${API_TODOLIST().base}`, () => {
    let family: any;
    let userTokenGenerated: string;
    const userEmail: string = 'user@email.com';

    let notVerifiedUser: any;
    let notVerifiedUserTokenGenerated: string;
    const notVerifiedEmail: string = 'not-verified-user@email.com';

    before(async () => {
      await dbClear(connection);

      family = await dbSeedFamily({
        familyHead: userEmail,
        hasFamily: true,
        hasTodoList: true,
      });

      userTokenGenerated = await Token.create({
        email: userEmail,
        id: family.familyHead.id,
      });

      notVerifiedUser = await dbSeedUser({
        email: notVerifiedEmail,
      });

      notVerifiedUserTokenGenerated = await Token.create({
        email: notVerifiedEmail,
        id: notVerifiedUser.id,
      });
    });

    describe('GET method', () => {
      it('should return specific todo-list', done => {
        request(APP)
          .get(API_TODOLIST(family.todoLists[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { todoList } = res.body;

            expect(todoList.id).to.be.a('number');
            expect(todoList.title).to.equal('some-todo-list-title');
            expect(todoList.isDone).to.equal(false);
            expect(todoList.createdAt).to.be.a('string');
            expect(todoList.author.id).to.equal(family.familyHead.id);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return 404 for not existing todo', done => {
        request(APP)
          .get(API_TODOLIST(999).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(404)
          .expect(res => {
            expect(res.body.errors.todoList).to.equal(defaultErrors.notFound);
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
});

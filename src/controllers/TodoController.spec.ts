import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUser, dbSeedFamily, dbClear } from '../utils/testsSeeds';
import { generateFullApi, API_TODOS, API_TODO } from '../constants/routes';
import { todosSuccesses } from '../constants/successes';
import { defaultErrors, todosErrors, emailErrors } from '../constants/errors';
import { Token } from '../controllers';

describe('Todo Controller', async () => {
  let connection = null;

  before(async () => {
    connection = await createConnection();
  });

  after(async () => {
    connection.close();
  });

  describe(`Route ${generateFullApi(API_TODOS)}`, () => {
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

      it('should create Todo if only title is provided', done => {
        request(APP)
          .post(generateFullApi(API_TODOS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({ title: 'some-todos-title' })
          .expect(200)
          .expect(res => {
            expect(res.body.todos).to.equal(todosSuccesses.todoCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should create Todo if full payload is provided', done => {
        request(APP)
          .post(generateFullApi(API_TODOS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({
            title: 'some-todos-title',
            description: 'some-description',
            deadline: 'some-deadline',
          })
          .expect(200)
          .expect(res => {
            expect(res.body.todos).to.equal(todosSuccesses.todoCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not valid payload', done => {
        request(APP)
          .post(generateFullApi(API_TODOS))
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
          .post(generateFullApi(API_TODOS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .type('form')
          .send({ title: 'some-todos-title' })
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
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

      let notVerifiedUser: any;
      let notVerifiedUserTokenGenerated: string;
      const notVerifiedEmail: string = 'not-verified-user@email.com';

      before(async () => {
        await dbClear(connection);

        family = await dbSeedFamily({
          familyHeadEmail: userEmail,
          hasTodos: true,
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

      it('should return todos', done => {
        request(APP)
          .get(generateFullApi(API_TODOS))
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { todos } = res.body;

            expect(todos.length).to.equal(1);
            expect(todos[0].title).to.equal('some-todos-title');
            expect(todos[0].description).to.equal('some-todos-description');
            expect(todos[0].createdAt).to.be.a('string');
            expect(todos[0].author.id).to.equal(family.familyHead.id);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .get(generateFullApi(API_TODOS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE method', () => {
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
          hasTodos: true,
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

      it('should delete todos', done => {
        request(APP)
          .delete(generateFullApi(API_TODOS))
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            expect(res.body.todos).to.equal(todosSuccesses.todosDeleted);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error message if there are no todos', done => {
        request(APP)
          .delete(generateFullApi(API_TODOS))
          .set('authorization', userTokenGenerated)
          .expect(409)
          .expect(res => {
            expect(res.body.errors.todos).to.equal(todosErrors.alreadyEmpty);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .delete(generateFullApi(API_TODOS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe(`Route ${API_TODO().base}`, () => {
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
        hasTodos: true,
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
      it('should return specific todo', done => {
        request(APP)
          .get(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { todos } = res.body;

            expect(todos.id).to.be.a('number');
            expect(todos.title).to.equal('some-todos-title');
            expect(todos.isDone).to.equal(false);
            expect(todos.createdAt).to.be.a('string');
            expect(todos.author.id).to.equal(family.familyHead.id);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return 404 for not existing todo', done => {
        request(APP)
          .get(API_TODO(999).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(404)
          .expect(res => {
            expect(res.body.errors.todos).to.equal(defaultErrors.notFound);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .get(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', notVerifiedUserTokenGenerated)
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('PATCH method', () => {
      it('should return updated not done todo', done => {
        request(APP)
          .patch(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({
            title: 'some-new-title',
          })
          .expect(200)
          .expect(res => {
            const { updatedTodo } = res.body;

            expect(updatedTodo.title).to.equal('some-new-title');
            expect(updatedTodo.updater).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
            expect(updatedTodo.executor).to.equal(null);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return updated done todo', done => {
        request(APP)
          .patch(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({
            isDone: true,
          })
          .expect(200)
          .expect(res => {
            const { updatedTodo } = res.body;

            expect(updatedTodo.updater).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
            expect(updatedTodo.executor).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for empty payload', done => {
        request(APP)
          .patch(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', notVerifiedUserTokenGenerated)
          .type('form')
          .send({})
          .expect(400)
          .expect(res => {
            expect(res.body.errors.payload).to.equal(defaultErrors.notAllowedValue);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not allowed payload', done => {
        request(APP)
          .patch(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', notVerifiedUserTokenGenerated)
          .type('form')
          .send({ notAllowedPayload: 'some-not-allowed-payload' })
          .expect(400)
          .expect(res => {
            expect(res.body.errors.payload).to.equal(defaultErrors.notAllowedValue);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .patch(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', notVerifiedUserTokenGenerated)
          .type('form')
          .send({
            title: 'some-new-title',
          })
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE method', () => {
      it('should return specific todo', done => {
        request(APP)
          .delete(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            expect(res.body.todo).to.be.a('object');
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return 404 for not existing todo', done => {
        request(APP)
          .delete(API_TODO(999).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(404)
          .expect(res => {
            expect(res.body.errors.todo).to.equal(defaultErrors.notFound);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .delete(API_TODO(family.todos[0].id).fullRoute)
          .set('authorization', notVerifiedUserTokenGenerated)
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});

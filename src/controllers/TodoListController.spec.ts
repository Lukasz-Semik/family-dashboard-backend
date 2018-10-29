import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUsers, dbClear } from '../utils/testsSeeds';
import { generateFullApi, API_TODOLISTS } from '../constants/routes';
import { todoListSuccesses } from '../constants/successes';
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
    describe('Post method', () => {
      let family: any;
      let userTokenGenerated: string;
      const userEmail: string = 'user@email.com';

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
      });

      after(async () => await dbClear(connection));

      it('should create TodoList', done => {
        request(APP)
          .post(generateFullApi(API_TODOLISTS))
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({ title: 'some-todo-title' })
          .expect(200)
          .expect(res => {
            expect(res.body.todoList).to.equal(todoListSuccesses.todoListCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});

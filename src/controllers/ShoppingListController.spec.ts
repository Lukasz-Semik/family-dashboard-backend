import { expect } from 'chai';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { APP } from '../server';
import { dbSeedUser, dbSeedFamily, dbClear } from '../utils/testsSeeds';
import { generateFullApi, API_SHOPPING_LISTS, API_SHOPPING_LIST } from '../constants/routes';
import { shoppingListsSuccesses } from '../constants/successes';
import { defaultErrors, shoppingListErrors, emailErrors } from '../constants/errors';
import { Token } from '../controllers';

describe('ShoppingList Controller', async () => {
  let connection = null;

  before(async () => {
    try {
      connection = await getConnection();
      if (!connection.isConnected) await connection.connect();
    } catch (e) {
      connection = await createConnection();
    }
  });

  after(async () => {
    if (connection.isConnected) await connection.close();
  });

  describe(`Route ${generateFullApi(API_SHOPPING_LISTS)}`, () => {
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

        after(async () => await dbClear(connection));
      });

      it('should create ShoppingList if proper payload is provided', done => {
        const payload = {
          title: 'shopping-list-title',
          items: [
            {
              name: 'item 1',
              isDone: false,
            },
            {
              name: 'item 2',
              isDone: true,
            },
          ],
        };

        request(APP)
          .post(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', userTokenGenerated)
          .set('Accept', 'application/json')
          .send(payload)
          // .expect(200)
          .expect(res => {
            console.log(res.body);
            expect(res.body.shoppingList).to.equal(shoppingListsSuccesses.shoppingListCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});

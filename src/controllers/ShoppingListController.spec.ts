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
    connection = await createConnection();
  });

  after(async () => {
    await connection.close();
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
      });

      after(async () => await dbClear(connection));

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

      it('should create ShoppingList if proper payload is provided', done => {
        request(APP)
          .post(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', userTokenGenerated)
          .set('Accept', 'application/json')
          .send(payload)
          .expect(200)
          .expect(res => {
            expect(res.body.shoppingList).to.equal(shoppingListsSuccesses.shoppingListCreated);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .post(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', notVerifiedUserTokenGenerated)
          .set('Accept', 'application/json')
          .send(payload)
          .expect(403)
          .expect(res => {
            expect(res.body.errors.email).to.equal(emailErrors.notVerified);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not lack of title', done => {
        request(APP)
          .post(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', userTokenGenerated)
          .set('Accept', 'application/json')
          .send({})
          .expect(400)
          .expect(res => {
            expect(res.body.errors.title).to.equal(defaultErrors.isRequired);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not lack of upcomingItems', done => {
        request(APP)
          .post(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', userTokenGenerated)
          .set('Accept', 'application/json')
          .send({
            ...payload,
            items: [
              {
                name: 'item 1',
                isDone: true,
              },
            ],
          })
          .expect(400)
          .expect(res => {
            expect(res.body.errors.items).to.equal(shoppingListErrors.emptyUpcomingItems);
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
          hasShoppingLists: true,
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

      it('should return shopping lists', done => {
        request(APP)
          .get(generateFullApi(API_SHOPPING_LISTS))
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { shoppingLists } = res.body;

            expect(shoppingLists.length).to.equal(1);
            expect(shoppingLists[0].title).to.equal('shopping-list-title');
            expect(shoppingLists[0].createdAt).to.be.a('string');
            expect(shoppingLists[0].author.id).to.equal(family.familyHead.id);
            expect(shoppingLists[0].items.length).to.equal(2);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .get(generateFullApi(API_SHOPPING_LISTS))
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

  describe(`Route ${API_SHOPPING_LIST().base}`, () => {
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
        hasShoppingLists: true,
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
      it('should return specific shopping list', done => {
        request(APP)
          .get(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(200)
          .expect(res => {
            const { shoppingList } = res.body;

            expect(shoppingList.title).to.equal('shopping-list-title');
            expect(shoppingList.createdAt).to.be.a('string');
            expect(shoppingList.author.id).to.equal(family.familyHead.id);
            expect(shoppingList.items.length).to.equal(2);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return 404 for not existing shopping list', done => {
        request(APP)
          .get(API_SHOPPING_LIST(999).fullRoute)
          .set('authorization', userTokenGenerated)
          .expect(404)
          .expect(res => {
            expect(res.body.errors.shoppingList).to.equal(defaultErrors.notFound);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for not verified user', done => {
        request(APP)
          .get(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
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
      it('should return updated not done shoppingList', done => {
        request(APP)
          .patch(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .type('form')
          .send({
            title: 'some-new-title',
          })
          .expect(200)
          .expect(res => {
            const { updatedShoppingList } = res.body;

            expect(updatedShoppingList.title).to.equal('some-new-title');
            expect(updatedShoppingList.updater).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
            expect(updatedShoppingList.executor).to.equal(null);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return updated done shoppingList', done => {
        request(APP)
          .patch(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
          .set('authorization', userTokenGenerated)
          .set('Accept', 'application/json')
          .send({
            items: [
              {
                name: 'item-1',
                isDone: true,
              },
              {
                name: 'item-2',
                isDone: true,
              },
            ],
          })
          .expect(200)
          .expect(res => {
            const { updatedShoppingList } = res.body;

            expect(updatedShoppingList.updater).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
            expect(updatedShoppingList.executor).to.deep.equal({
              id: family.familyHead.id,
              firstName: family.familyHead.firstName,
              lastName: family.familyHead.lastName,
            });
            expect(updatedShoppingList.isDone).to.equal(true);
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });

      it('should return proper error messages for empty payload', done => {
        request(APP)
          .patch(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
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
          .patch(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
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
          .patch(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
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

      describe('DELETE method', () => {
        it('should return specific todo', done => {
          request(APP)
            .delete(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
            .set('authorization', userTokenGenerated)
            .expect(200)
            .expect(res => {
              expect(res.body.shoppingList).to.be.a('object');
            })
            .end(err => {
              if (err) return done(err);
              done();
            });
        });

        it('should return 404 for not existing todo', done => {
          request(APP)
            .delete(API_SHOPPING_LIST(999).fullRoute)
            .set('authorization', userTokenGenerated)
            .expect(404)
            .expect(res => {
              expect(res.body.errors.shoppingList).to.equal(defaultErrors.notFound);
            })
            .end(err => {
              if (err) return done(err);
              done();
            });
        });

        it('should return proper error messages for not verified user', done => {
          request(APP)
            .delete(API_SHOPPING_LIST(family.shoppingLists[0].id).fullRoute)
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
});

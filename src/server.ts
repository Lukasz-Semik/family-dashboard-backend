import 'reflect-metadata';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import authenticate from './services/authenticate';
import {
  UserController,
  FamilyController,
  TodoController,
  ShoppingListController,
} from './controllers';

export const APP: express.Application = express();

const PORT: number = Number(process.env.PORT) || 8080;

// tslint:disable no-console
export const DbConnection = createConnection()
  .then(() => console.log('Database connection established'))
  .catch(error => console.log('TypeORM connection error: ', error));

useExpressServer(APP, {
  routePrefix: '/api',
  controllers: [UserController, FamilyController, TodoController, ShoppingListController],
  authorizationChecker: authenticate,
  middlewares: [cors],
});

APP.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
  // tslint:enable
});

import 'reflect-metadata';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';

import { UserController } from './controllers/CheckerController';

const APP: express.Application = express();

const PORT: number = Number(process.env.PORT) || 8080;

export const DbConnection = createConnection()
  .then(conn => console.log('Database connection established'))
  .catch(error => console.log('TypeORM connection error: ', error));

useExpressServer(APP, {
  routePrefix: '/api',
  controllers: [UserController],
});

APP.listen(PORT, () => {
  // tslint:disable no-console
  console.log(`App is running on ${PORT}`);
  // tslint:enable
});

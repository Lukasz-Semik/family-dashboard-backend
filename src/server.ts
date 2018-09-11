import 'reflect-metadata';
import express from 'express';
import logger from 'morgan';
import { useExpressServer } from 'routing-controllers';

import { UserController } from './controllers/CheckerController';

const APP: express.Application = express();

const PORT: number = Number(process.env.PORT) || 8080;

APP.use(logger('dev'));

useExpressServer(APP, {
  routePrefix: '/api',
  controllers: [UserController],
});

APP.listen(PORT, () => {
  // tslint:disable no-console
  console.log(`App is running on ${PORT}`);
  // tslint:enable
});

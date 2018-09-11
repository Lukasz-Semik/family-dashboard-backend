import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

const APP: express.Application = express();

const PORT: number = Number(process.env.PORT) || 8080;

APP.use(bodyParser);
APP.use(bodyParser.urlencoded({ extended: false }));
APP.use(logger('dev'));

APP.listen(PORT, () => {
  // tslint:disable no-console
  console.log(`App is running on ${PORT}`);
  // tslint:enable
});

import * as bodyParser from 'body-parser';

export const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

export default urlencodedParser;

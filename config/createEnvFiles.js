const fs = require('fs');
const path = require('path');

const devEnvPath = path.join(__dirname, '../.env.development');
const testEnvPath = path.join(__dirname, '../.env.test');

const devContent = `DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=***Your database username***
DB_PASSWORD=***Your database password, if you did not setup, put null***
DB_NAME=family-dashboard-dev
NODE_PORT=8080
JWT_TOKEN=secret-token
SENDGRID_API_KEY=***Sendgrid api key goes here***
`;

const testContent = `DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=***Your database username***
DB_PASSWORD=***Your database password, if you did not setup, put null***
DB_NAME=family-dashboard-dev
NODE_PORT=8000
JWT_TOKEN=secret-token
`;

fs.writeFile(devEnvPath, devContent, err => {
  if (err) throw err;

  fs.writeFile(testEnvPath, testContent, err => {
    if (err) throw err;

    // eslint-disable-next-line no-console
    console.log('Env files has been succesfully saved!');
  });
});

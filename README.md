# FAMILY DASHBOARD APP

### Backend repo

This is a repo for backend part of Family Dashboard App.
Frontend part you can find [here](https://github.com/Lukasz-Semik/family-dashboard-frontend)

### Technology stack

- [node](https://nodejs.org) + [ts-node](https://github.com/TypeStrong/ts-node)
- [typescript](https://www.typescriptlang.org)
- [express](http://expressjs.com)
- [routing-controllers](https://github.com/typestack/routing-controllers)
- [typeorm](http://typeorm.io)
- [postgresql](https://www.postgresql.org)
- [sendgrid](https://sendgrid.com)
- [mocha](https://mochajs.org) + [chai](https://www.chaijs.com)
- [heroku](https://www.heroku.com)
- smaller packages

### Development

1. Clone this repo, prepare and run your local database `postgresql`.
2. Run `yarn`.
3. In separate tab, run `yarn prepareDev`. This command will create a secret .env files.
4. Fill in .env.development and .env.test with proper values (you can create your own credentials)
5. Run `yarn dev`. Project will run on `port 8080`.

### Deployment

To deploy to production, run `yarn deploy`. NOTE: This command will firstly checkout to master and pull the origin one. After that, it will push the master to `heroku`. Deployment will not be successfull without permission given on `heroku`.

Production BE url: `https://family-dashboard-be.herokuapp.com/`

### Tests

For tests, run `yarn test`.

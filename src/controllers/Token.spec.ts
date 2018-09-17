import { expect } from 'chai';

import Token from './Token';
import { users } from '../constants/testFixtures';
import { equal } from 'assert';

describe('Token', () => {
  it('should create and decode token', async () => {
    const token = await Token.create({ email: users[0].email });
    const decodedToken = await Token.decode(token);
    const { email, iat, exp } = decodedToken;

    expect(token).to.be.a('string');
    expect(email).to.equal(users[0].email);
    expect(iat).to.be.a('number');
    expect(exp).to.be.a('number');
  });
});

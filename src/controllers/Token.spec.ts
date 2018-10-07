import { expect } from 'chai';

import { Token } from '.';
import { notSeededUsers } from '../constants/testFixtures';

describe('Token', () => {
  it('should create and decode token', async () => {
    const token = await Token.create({ email: notSeededUsers[0].email });
    const decodedToken = await Token.decode(token);
    const { email, iat, exp } = decodedToken;

    expect(token).to.be.a('string');
    expect(email).to.equal(notSeededUsers[0].email);
    expect(iat).to.be.a('number');
    expect(exp).to.be.a('number');
  });
});

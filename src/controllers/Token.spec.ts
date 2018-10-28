import { expect } from 'chai';

import { Token } from '.';

describe('Token', () => {
  it('should create and decode token', async () => {
    const token = await Token.create({ email: 'some@email.com' });
    const decodedToken = await Token.decode(token);
    const { email, iat, exp } = decodedToken;

    expect(token).to.be.a('string');
    expect(email).to.equal('some@email.com');
    expect(iat).to.be.a('number');
    expect(exp).to.be.a('number');
  });
});

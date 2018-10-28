import { expect } from 'chai';

import { Token } from '.';

describe('Token', () => {
  it('should create and decode token witout id', async () => {
    const token = await Token.create({ email: 'some@email.com' });
    const decodedToken = await Token.decode(token);
    const { email, id, iat, exp } = decodedToken;

    expect(id).to.equal(undefined);
    expect(token).to.be.a('string');
    expect(email).to.equal('some@email.com');
    expect(iat).to.be.a('number');
    expect(exp).to.be.a('number');
  });

  it('should create and decode token with id', async () => {
    const token = await Token.create({ email: 'some@email.com', id: 1 });
    const decodedToken = await Token.decode(token);
    const { email, id, iat, exp } = decodedToken;

    expect(id).to.equal(1);
    expect(token).to.be.a('string');
    expect(email).to.equal('some@email.com');
    expect(iat).to.be.a('number');
    expect(exp).to.be.a('number');
  });
});

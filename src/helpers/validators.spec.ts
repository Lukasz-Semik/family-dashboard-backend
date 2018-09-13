import { expect } from 'chai';

import { isBlank } from './validators';

describe('isBlank()', () => {
  it('should return true for undefined', () => {
    expect(isBlank(undefined)).to.equal(true);
  });

  it('should return true for null', () => {
    expect(isBlank(null)).to.equal(true);
  });

  it('should return true for empty string', () => {
    expect(isBlank('')).to.equal(true);
  });

  it('should return false for any argument', () => {
    expect(isBlank('test')).to.equal(false);
  });
});

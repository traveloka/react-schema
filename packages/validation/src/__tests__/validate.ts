import { validate } from '../index';

const valid = () => null;
const invalid = () => 'invalid';
const invalid2 = () => 'invalid2';

describe('test validate', () => {
  it('should accept rule as single value', () => {
    expect(validate(valid)(null)).toBeFalsy();
    expect(validate(invalid)(null)).toBeTruthy();
  });

  it('should accept rule as array (behave like AND)', () => {
    expect(validate([valid, valid, valid])(null)).toBeFalsy();
    expect(validate([valid, invalid, valid])(null)).toBeTruthy();
    expect(validate([valid, valid, invalid])(null)).toBeTruthy();
  });

  it('should return the first error', () => {
    expect(validate([invalid2, valid, invalid])(null)).toEqual('invalid2');
    expect(validate([valid, [invalid, invalid2], invalid])(null)).toEqual('invalid');
    expect(validate([valid, [invalid2, invalid], invalid])(null)).toEqual('invalid2');
  });

  it('should pass any argument after value', () => {
    const rule = (_, ...msg) => msg.join(',');
    expect(validate(rule)(null, 1, 2, 3)).toEqual('1,2,3');
  });
});

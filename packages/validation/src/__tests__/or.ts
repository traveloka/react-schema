import { or } from '../index';

const valid = () => null;
const invalid = () => 'invalid';
const invalid2 = () => 'invalid2';

describe('test or', () => {
  it('should return falsy even 1 rule is valid', () => {
    const result = or([invalid, invalid, invalid, valid])('');
    expect(result).toBeFalsy();
  });

  it('should return truthy since all is invalid', () => {
    const result = or([invalid, invalid, invalid])('');
    expect(result).toBeTruthy();
  });

  it('should except param as not array', () => {
    let result = null;
    result = or(invalid)('');
    expect(result).toBeTruthy();
    result = or(valid)('');
    expect(result).toBeFalsy();
  });

  it('should return the last error', () => {
    let result = null;
    result = or([invalid2, invalid])('');
    expect(result).toEqual('invalid');
    result = or([invalid, invalid2])('');
    expect(result).toEqual('invalid2');
  });

  it('should skip if the first rule is valid', () => {
    let result = null;
    result = or([valid, invalid2, invalid])('');
    expect(result).toBeFalsy();
  });

  it('should be falsy parameter empty array []', () => {
    let result = null;
    result = or([])('');
    expect(result).toBeFalsy();
  });
});

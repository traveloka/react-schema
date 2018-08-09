import { maxLength } from '../index';
import { ValidationResult } from '../types';

describe('test maxLength', () => {
  it('should return falsy for empty string', () => {
    const result:ValidationResult = maxLength(5)('');
    expect(result).toBeFalsy();
  });

  it('should return falsy for empty array', () => {
    const result:ValidationResult = maxLength(5)([]);
    expect(result).toBeFalsy();
  });

  it('should return truthy for exceeded length string', () => {
    const result:ValidationResult = maxLength(5)('abcdef');
    expect(result).toBeTruthy();
  });

  it('should return truthy for exceeded length array', () => {
    const result:ValidationResult = maxLength(5)([1,2,3,4,5,6]);
    expect(result).toBeTruthy();
  });
});

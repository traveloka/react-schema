import { required } from '../index';

describe('test required', () => {
  it('should return truthy because value is null', () => {
    const result = required(null);
    expect(result).toBeTruthy();
  });

  it('should return truthy because value is undefined', () => {
    const result = required(undefined);
    expect(result).toBeTruthy();
  });

  it("should return falsy because value 0", () => {
    const result = required(0);
    expect(result).toBeFalsy();
  });

  it("should return truthy because value is ''", () => {
    const result = required('');
    expect(result).toBeTruthy();
  });

  it("should return falsy because value 'a'", () => {
    const result = required('a');
    expect(result).toBeFalsy();
  });

  it("should return truthy because value is {}", () => {
    const result = required({});
    expect(result).toBeTruthy();
  });

  it("should return falsy because value is {name: null}", () => {
    const result = required({name: null});
    expect(result).toBeFalsy();
  });

  it("should return truthy because value is []", () => {
    const result = required([]);
    expect(result).toBeTruthy();
  });

  it("should return falsy because value is [1]", () => {
    const result = required([1]);
    expect(result).toBeFalsy();
  });

  it("should return error message because value is null", () => {
    const result = required(null, 'custom error message');
    expect(result).toEqual('custom error message');
  });

  it("should not return error message because value is a date", () => {
    const result = required(new Date());
    expect(result).toBeFalsy();
  });
});

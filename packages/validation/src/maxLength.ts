import { Validation, ValidationResult } from './types';

type LengthableType = string | any[];

export const maxLength: (n: number) => Validation = (n) => (value: LengthableType, errorMessage?: string): ValidationResult => {
  if (value.length > n) return errorMessage || `Length must less than ${n}`;
  return null;
}

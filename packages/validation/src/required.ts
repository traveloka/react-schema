import { ValidationResult, Validation } from "./types";

export const required: Validation = (value: any, errorMessage?: string): ValidationResult => {
  if (value === null || value === undefined || value === '' || (typeof value === 'object' && Object.keys(value).length === 0))
    return errorMessage || 'Required';
  return null;
}

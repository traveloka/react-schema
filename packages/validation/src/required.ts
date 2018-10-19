import { ValidationResult, Validation } from "./types";

export const required: Validation = (value: any, errorMessage?: string): ValidationResult => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (value.constructor === Object && Object.keys(value).length === 0) ||
    (Array.isArray(value) && !value.length)
  )
    return errorMessage || 'Required';
  return null;
}

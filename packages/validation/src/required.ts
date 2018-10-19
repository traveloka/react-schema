import { ValidationResult, Validation } from "./types";

export const required: Validation = (value: any, errorMessage?: string): ValidationResult => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (Object.keys(value).length === 0 && value.constructor === Object) ||
    (Array.isArray(value) && !value.length)
  )
    return errorMessage || 'Required';
  return null;
}

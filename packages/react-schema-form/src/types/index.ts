import { Validation, ValidationResult } from '@traveloka/validation';

export type Rule = Validation | Validation[];
export type FormFieldValidationResult = ValidationResult | ValidationResultByName;

export type ValidationResultByName = {
  [name: string]: ValidationResult
} | null;

export type ValueByName = {
  [name: string]: any
} | null;

export interface FormFieldInterface {
  getValue: () => any,
  setValue: (value: any) => any,
  getError: () => FormFieldValidationResult | null,
  setError: (error: FormFieldValidationResult) => FormFieldValidationResult,
  validate: () => FormFieldValidationResult,
  reset: () => void,
  initialize: (value: ValueByName | any) => ValueByName | any
  getDefaultValue: () => ValueByName | any
  hasError: () => boolean
  isDirty: () => boolean
}

export interface FieldInterface extends FormFieldInterface {
  getValue: () => any,
  setValue: (value: any) => any,
  getError: () => ValidationResult,
  setError: (error: ValidationResult) => ValidationResult,
  validate: () => ValidationResult,
  reset: () => void,
  initialize: (value: any) => any
  getDefaultValue: () => any
  hasError: () => boolean
  isDirty: () => boolean
}


export type FieldByName = {
  [name: string]: FormFieldInterface,
}

export interface FormInterface extends FormFieldInterface {
  fields: FieldByName,
  notifyOnChange: (name: string, value: any) => void,
  notifyOnError: (name: string, error: ValidationResult) => void,

  getValue: () => any,
  setValue: (value: any) => any,
  getError: () => ValidationResultByName,
  setError: (error: FormFieldValidationResult) => ValidationResultByName,
  validate: () => ValidationResultByName,
  reset: () => void,
  initialize: (value: ValueByName) => ValueByName
  getDefaultValue: () => ValueByName
  hasError: () => boolean
  hasErrorField: (name: string) => boolean
  isDirty: () => boolean
  isDirtyField: (name: string) => boolean

  getValueField: (name: string) => any,
  setValueField: (name: string, value: any) => any,
  removeField: (name: string) => any,
  getErrorField: (name: string) => FormFieldValidationResult,
  setErrorField: (name: string, error: FormFieldValidationResult) => FormFieldValidationResult,
  validateField: (name: string) => FormFieldValidationResult,
}

export type FieldComponentProps<T = any> = {
  value: T;
  onChange: (value: T) => void;
  label?: string;
  isDirty?: boolean;
  error?: string;
  name?: string;
};

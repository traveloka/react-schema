import * as React from 'react';
import {
  KeyedEntity,
  getEntityProps,
  getReactEntityComponent,
  createSchema
} from '@traveloka/react-schema';
import { Field } from './Field';
import { ValidationResult } from '../node_modules/@traveloka/validation';

type ValidationResultByName = {
  [name: string]: ValidationResult
}

interface Form {
  getValue: (name:string) => any,
  getValues: () => {[name: string]: any},
  setValue: (name:string, value: any) => any,
  setValues: (value: {[name: string]: any}) => any,
  getError: (name: string) => ValidationResult,
  getErrors: () => ValidationResultByName,
  setError: (name: string, error: ValidationResult) => ValidationResult,
  setErrors: (errors: ValidationResultByName) => ValidationResultByName,
  validate: () => ValidationResultByName,
  validateField: (name: string) => ValidationResult,
}

type FieldByName = {
  [name: string]: Field,
}

type FormProps = {
  onChange: (name: string, value: any) => void,
}

export function createForm(schemaEntity: KeyedEntity): React.ComponentClass<any> {
  const Component = class FormComponent extends React.Component<FormProps> implements Form {
    public fields: FieldByName = {};

    public render() {
      const formEntity: KeyedEntity = {};
      Object.entries(schemaEntity).map(([name, fieldComponent]) => {
        const FieldComponent = getReactEntityComponent(fieldComponent);
        const { defaultValue, rules, ...fieldProps } = getEntityProps(fieldComponent);
        formEntity[name] = {
          component: Field,
          onChange: (value:any) => this.props.onChange(name, value),
          rules,
          defaultValue,
          name,
          fieldProps,
          fieldComponent: FieldComponent
        }
      });
      const SchemaComponent = createSchema(formEntity);
      return (
        <SchemaComponent
          ref={(el: any) => {
            this.fields = el.entities;
          }}
        />
      )
    }

    public getValue = (name: string): any => {
      return this.fields[name].getValue();
    }

    public getValues = ():{[name: string]: any} => {
      return Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.getValue(name),
      }), {})
    }

    public setValue = (name: string, value: any): any => {
      return this.fields[name].setValue(value);
    }

    public setValues = (values: {[name: string]: any}): any => {
      Object.entries(values).map(([name, value]) => this.setValue(name, value));
      return this.getValues();
    }

    public getError = (name: string): ValidationResult => {
      return this.fields[name].getError();
    }

    public getErrors = ():{[name: string]: ValidationResult} => {
      return Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.getError(name),
      }), {})
    }

    public setError = (name: string, error: ValidationResult): ValidationResult => {
      return this.fields[name].setError(error);
    }

    public setErrors = (errors: {[name: string]: ValidationResult}): any => {
      Object.entries(errors).map(([name, error]) => this.setError(name, error));
      return this.getErrors();
    }

    public validateField = (name: string): ValidationResult => {
      return this.fields[name].validate();
    }

    public validate = ():{[name: string]: ValidationResult} => {
      Object.keys(schemaEntity).map(this.validateField);
      return this.getErrors();
    }
  }
  return Component;
}

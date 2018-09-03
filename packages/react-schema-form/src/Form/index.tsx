import * as React from 'react';

import { FormFieldInterface, FormFieldValidationResult, ValidationResultByName, ValueByName } from '../types';
import registerField from '../Field/registerField';
import FormContext from './FormContext';


type FieldByName = {
  [name: string]: FormFieldInterface,
}

type FormState = {
  isDirty: boolean,
  hasError: boolean,
}

type FormProps = {
  children: any
}

const K_FORM_TYPE = 'REACT_SCHEMA_FORM';

class FormComponent extends React.PureComponent<FormProps, FormState> {
  public static type:string = K_FORM_TYPE;
  public fields: FieldByName = {};

  public getContextType = () => {
    return {
      fields: this.fields,
      notifyOnChange: () => this.handleFieldOnChange
    }
  }

  public render() {
    return (
      <FormContext.Provider value={this.getContextType()}>
        {typeof this.props.children === 'function' ? this.props.children(this.state) : this.props.children}
      </FormContext.Provider>
    );
  }

  public getValueField = (name : string): any => {
    if (this.fields[name]) {
      return this.fields[name].getValue();
    }
    return null;
  }
  public getValue = ():{[name: string]: any} => {
    return Object.keys(this.fields).reduce((values, name) => ({
      ...values,
      [name]: this.getValueField(name),
    }), {})
  }
  public getValues = () => this.getValue();

  public setValueField = (name: string, value: any): any => {
    if (this.fields[name]) {
      return this.fields[name].setValue(value);
    }
    return null;
  }
  public setValue = (values: {[name: string]: any}): any => {
    Object.entries(values).map(([name, value]) => this.setValueField(name, value));
    return this.getValues();
  }
  public setValues = (values: {[name: string]: any}): any => this.setValue(values);

  public getErrorField = (name: string): FormFieldValidationResult => {
    if (this.fields[name]) {
      return this.fields[name].getError();
    }
    return null;
  }
  public getError = (): ValidationResultByName => {
    const errors = Object.keys(this.fields).reduce((values, name) => ({
      ...values,
      [name]: this.getErrorField(name),
    }), {});
    if (Object.values(errors).filter(Boolean).length === 0) return null;
    return errors;
  }
  public getErrors = (): ValidationResultByName => this.getError();

  public setErrorField = (name: string, error: FormFieldValidationResult): FormFieldValidationResult => {
    if (this.fields[name]) {
      return this.fields[name].setError(error);
    }
    return null;
  }
  public setError = (errors: ValidationResultByName): any => {
    if (!errors) return null;
    Object.entries(errors).map(([name, error]) => this.setErrorField(name, error));
    return this.getErrors();
  }
  public setErrors = (errors:  ValidationResultByName): any => this.setError(errors);

  public validateField = (name: string): FormFieldValidationResult => {
    if (this.fields[name]) {
      return this.fields[name].validate();
    }
    return null;
  }
  public validate = (): ValidationResultByName => {
    const errors = Object.keys(this.fields).reduce((values, name) => ({
      ...values,
      [name]: this.validateField(name),
    }), {});
    if (Object.values(errors).filter(Boolean).length === 0) return null;
    return errors;
  }

  public reset = (): void => {
    Object.keys(this.fields).forEach(fieldName => {
      this.fields[fieldName].reset();
    })
  }

  public getDefaultValueField = (name: string): any => {
    if (this.fields[name]) {
      return this.fields[name].getDefaultValue();
    }
    return null;
  }

  public getDefaultValue = (): ValueByName => {
    const values = Object.keys(this.fields).reduce((prev, name) => ({
      ...prev,
      [name]: this.getDefaultValueField(name),
    }), {});
    return values;
  }

  public initializeField = (name: string, value: any): any => {
    if (this.fields[name]) {
      return this.fields[name].initialize(value);
    }
    return null;
  }
  public initialize = (values: ValueByName): ValueByName => {
    if (!values) return null;
    Object.entries(values).map(([name, value]) => this.initializeField(name, value));
    return this.getDefaultValue();
  }

  public isDirtyField = (name: string): boolean => {
    if (this.fields[name]) {
      return this.fields[name].isDirty();
    }
    return false;
  }
  public isDirty = (): boolean => {
    return Object.keys(this.fields).reduce((isDirty, name) => isDirty || this.isDirtyField(name), false);
  }

  public hasErrorField = (name: string): boolean => {
    if (this.fields[name]) {
      return this.fields[name].hasError();
    }
    return false;
  }
  public hasError = (): boolean => {
    return Object.keys(this.fields).reduce((hasError, name) => hasError || this.hasErrorField(name), false);
  }

  private handleFieldOnChange = () => {
    const isDirty = this.isDirty();
    const hasError = this.hasError();
    this.setState({
      isDirty,
      hasError,
    });
  }
}

export default registerField(FormComponent);

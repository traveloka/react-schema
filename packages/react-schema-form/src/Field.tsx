import * as React from 'react';
import {
  Rule,
  ValidationResult,
  validate
} from '@traveloka/validation';

interface FieldInterface {
  getValue: () => any,
  setValue: (value: any) => any,
  getError: () => ValidationResult,
  setError: (error: ValidationResult) => ValidationResult,
  validate: () => ValidationResult,
  reset: () => void,
};

type FieldProps = {
  value?: any,
  revalidateOnError ?: boolean,
  validateOnChange ?: boolean,
  name?: string,
  label?: string,
  fieldComponent: React.ComponentClass<any>,
  onChange?: (value:any) => void,
  fieldProps?: object,
  defaultValue?: any,
  rules?: Rule
}

type FieldState = {
  value: any,
  error: ValidationResult,
}

export class Field extends React.Component<FieldProps, FieldState> implements FieldInterface {

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.defaultValue,
      error: null,
    }
  }

  public render() {
    const { name, fieldComponent: FieldComponent, fieldProps } = this.props;
    const label = this.ucwords(name);
    return (
      <FieldComponent
        label={label}
        {...fieldProps}
        name={name}
        value={this.getValue()}
        error={this.getError()}
        onChange={this.handleOnChange}
      />
    );
  }

  public validate = () => {
    const { rules = [] } = this.props;
    const error = validate(rules)(this.getValue());
    this.setError(error);
    return error;
  }

  public getValue = () => {
    if (this.props.value !== undefined) {
      return this.props.value;
    }
    return this.state.value;
  }

  public setValue = (value: any) => {
    this.setState({
      value
    }, () => {
      const { revalidateOnError, validateOnChange } = this.props;
      if (validateOnChange || (revalidateOnError && this.getError())) {
        this.validate();
      }
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  public getError = () => {
    return this.state.error;
  }

  public setError = (error: ValidationResult) => {
    this.setState({
      error
    });
    return error;
  }

  public reset = () => {
    this.setValue(null);
    this.setError(null);
  }

  private handleOnChange = (value: any) => {
    return this.setValue(value);
  }

  private ucwords = (str ?: string) => {
    if (!str) return null;
    return str.toLowerCase().replace(/\b[a-z]/g, letter => {
      return letter.toUpperCase();
    });
  }
}

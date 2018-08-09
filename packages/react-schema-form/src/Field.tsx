import * as React from 'react';
import {
  Rule,
  ValidationResult,
  validate
} from '@traveloka/validation';

interface FieldInterface {
  getValue: () => any,
  validate: () => ValidationResult,
  reset: () => void,
};

type FieldProps = {
  fieldComponent: React.ComponentClass<any>,
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
    const { fieldComponent: FieldComponent, fieldProps } = this.props;
    return (
      <FieldComponent
        {...fieldProps}
        value={this.getValue()}
        error={this.getError()}
        onChange={this.handleOnChange}
      />
    );
  }

  public validate = () => {
    const { rules = [] } = this.props;
    const error = validate(rules)(this.getValue);
    this.setState({
      error,
    });
    return error;
  }

  public getValue = () => {
    return this.state.value;
  }

  public getError = () => {
    return this.state.error;
  }

  public reset = () => {
    this.setState({
      value: null,
      error: null,
    })
  }

  private handleOnChange = (value: any) => {
    this.setState({
      value
    })
  }
}

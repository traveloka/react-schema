import * as React from "react";
import { Rule, ValidationResult, validate } from "@traveloka/validation";
import { FieldInterface } from "../types";
import registerField from "./registerField";

type FieldProps = {
  component: React.ComponentClass<any, any>;
  revalidateOnError?: boolean;
  validateOnChange?: boolean;
  normalize: (value: any) => any;
  name?: string;
  label?: string;
  onChange?: (value: any) => void;
  onError?: (error: ValidationResult) => any;
  defaultValue?: any;
  rules?: Rule;
  [key: string]: any;
};

type FieldState = {
  value: any;
  defaultValue: any;
  error: ValidationResult;
};

class FieldComponent extends React.Component<FieldProps, FieldState>
  implements FieldInterface {
  public static defaultProps = {
    revalidateOnError: true,
    validateOnChange: false,
    normalize: (value: any) => value
  };

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.normalize(props.value || props.defaultValue),
      defaultValue: props.defaultValue,
      error: null
    };
  }

  public componentDidMount() {
    if (this.props.onChange) this.props.onChange(this.getValue());
  }

  public render() {
    const { component: WrapperComponent, name, ...rest } = this.props;
    const label = this.ucwords(name);
    return (
      <WrapperComponent
        label={label}
        value={this.getValue()}
        isDirty={this.isDirty()}
        error={this.getError()}
        {...rest}
        onChange={this.handleOnChange}
      />
    );
  }

  public validate = (): ValidationResult => {
    const { rules = [] } = this.props;
    const error = validate(rules)(this.getValue());
    this.setError(error);
    return error;
  };

  public getValue = (): any => {
    return this.props.normalize(this.props.value || this.state.value);
  };

  public setValue = (dirtyValue: any): void => {
    const value = this.props.normalize(dirtyValue);
    this.setState(
      {
        value
      },
      () => {
        const { revalidateOnError, validateOnChange } = this.props;
        if (validateOnChange || (revalidateOnError && this.getError())) {
          this.validate();
        }
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      }
    );
  };

  public getError = () => {
    return this.state.error;
  };

  public setError = (error: ValidationResult) => {
    this.setState(
      {
        error
      },
      () => {
        if (this.props.onError) {
          this.props.onError(error);
        }
      }
    );
    return error;
  };

  public reset = () => {
    this.setValue(this.state.defaultValue);
    this.setError(null);
  };

  public handleOnChange = (value: any) => {
    return this.setValue(value);
  };

  public ucwords = (str?: string) => {
    if (!str) return null;
    return str.toLowerCase().replace(/\b[a-z]/g, letter => {
      return letter.toUpperCase();
    });
  };

  public initialize = (value: any) => {
    this.setState(
      {
        defaultValue: value
      },
      () => {
        this.setValue(value);
      }
    );
  };

  public getDefaultValue = () => {
    return this.state.defaultValue;
  };

  public isDirty = () => {
    const { value, defaultValue } = this.state;
    return value !== defaultValue;
  };

  public hasError = () => {
    return !!this.getError();
  };
}

export default registerField(FieldComponent);

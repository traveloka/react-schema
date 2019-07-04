import * as React from "react";
import { Rule, ValidationResult, validate } from "@traveloka/validation";
import { FieldInterface } from "../types";
import registerField from "./registerField";
import isEqual from "lodash/isEqual";

type ComponentProps = {
  value: any;
  onChange: (value: any) => void;
  label?: string;
  isDirty?: boolean;
  error?: string;
  name?: string;
};

type FieldProps = {
  component: React.ComponentClass<ComponentProps, any>;
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

  private _value: any = null; //deferred value, to handle async setState
  private _error: any = null; //deferred error, to handle async setState
  private _defaultValue: any = null; //deferred defaultValue, to handle async setState

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.normalize(props.value || props.defaultValue),
      defaultValue: props.normalize(props.defaultValue),
      error: null
    };
  }

  public componentDidMount() {
    if (this.props.onChange) this.props.onChange(this.getValue());
  }

  public componentDidUpdate(prevProps: FieldProps, prevState: FieldState) {
    if (!isEqual(prevProps.value, this.props.value)) {
      this.setValue(this.props.value);
    }
  }

  public render() {
    const { component: WrapperComponent, name, ...rest } = this.props;
    const label = this.ucwords(name);
    return (
      <WrapperComponent
        label={label}
        isDirty={this.isDirty()}
        error={this.getError()}
        name={name}
        {...rest}
        value={this.getValue()}
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
    if (this._value !== null) return this._value;
    return this.state.value;
  };

  public setValue = (dirtyValue: any): void => {
    const value = this.props.normalize(dirtyValue);

    this._value = value; // update deferred value
    this.setState(
      {
        value
      },
      () => {
        this._value = null; // clear deferred value
      }
    );
    const { revalidateOnError, validateOnChange } = this.props;
    if (validateOnChange || (revalidateOnError && this.getError())) {
      this.validate();
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  public getError = () => {
    if (this._error !== null) return this._error;
    return this.state.error;
  };

  public setError = (error: ValidationResult) => {
    this._error = error;
    this.setState(
      {
        error
      },
      () => {
        this._error = null;
      }
    );
    if (this.props.onError) {
      this.props.onError(error);
    }
    return error;
  };

  public reset = () => {
    this.setValue(this.getDefaultValue());
    this.setError(null);
  };

  public handleOnChange = (value: any) => {
    return this.setValue(value);
  };

  public ucwords = (str?: string) => {
    if (!str) return;
    return str.toLowerCase().replace(/\b[a-z]/g, letter => {
      return letter.toUpperCase();
    });
  };

  public initialize = (value: any) => {
    this._defaultValue = value;
    this.setState(
      {
        defaultValue: value
      },
      () => {
        this._defaultValue = null;
      }
    );
    this.setValue(value);
  };

  public getDefaultValue = () => {
    if (this._defaultValue !== null) return this._defaultValue;
    return this.state.defaultValue;
  };

  public isDirty = () => {
    return !isEqual(this.getValue(), this.getDefaultValue());
  };

  public hasError = () => {
    return !!this.getError();
  };
}

export default registerField(FieldComponent);

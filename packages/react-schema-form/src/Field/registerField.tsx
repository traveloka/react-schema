import * as React from "react";

import { FormInterface, FieldInterface } from "../types";
import { withForm } from "../Form/FormContext";

type FormFieldProps = {
  name?: string;
  [prop: string]: any;
};

export default function registerField(
  WrapperComponent: React.ComponentClass<any, any>
): React.ComponentClass<any, any> {
  const Wrapper = class extends React.Component<FormFieldProps, any> {
    public componentWillUnmount() {
      const { form, name } = this.props;
      if (form) {
        form.removeField(name);
      }
    }

    public render() {
      const { form } = this.props;
      return (
        <WrapperComponent
          {...this.props}
          ref={(el: any) => el && this.handleRegisterField(el, form)}
          onChange={(value: any) => this.handleSubscribeOnChange(value, form)}
          onError={(error: any) => this.handleSubscribeOnError(error, form)}
        />
      );
    }

    public handleRegisterField = (el: FieldInterface, form?: FormInterface) => {
      if (this.props.fieldRef) {
        this.props.fieldRef(el);
      }
      const { name } = this.props;
      if (!form || !el) return;
      if (!name) {
        console.warn(`FormFieldComponent didn't have any name!`);
        return;
      }
      if (!form.fields[name]) {
        form.fields[name] = el;
        form.notifyOnChange(name, el.getValue());
      }
    };

    public handleSubscribeOnChange = (value: any, form?: FormInterface) => {
      const { name } = this.props;
      if (form && name) {
        form.notifyOnChange(name, value);
      }
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    };

    public handleSubscribeOnError = (error: any, form?: FormInterface) => {
      const { name } = this.props;
      if (form && name) {
        form.notifyOnError(name, error);
      }
      if (this.props.onError) {
        this.props.onError(error);
      }
    };
  };
  return withForm(Wrapper);
}

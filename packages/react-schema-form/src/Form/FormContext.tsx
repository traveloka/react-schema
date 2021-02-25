import React from 'react';
import { FieldByName, FormInterface } from '../types';

type FormContextValue = {
  fields: FieldByName
} | undefined

const FormContext = React.createContext<FormContextValue>(undefined);

export function withForm(WrapperComponent: React.ComponentClass<any>): React.ComponentClass<any> {
  const Comp = class extends React.Component {
    public render() {
      return (
        <FormContext.Consumer>
          {(form: FormInterface) => (
            <WrapperComponent form={form} {...this.props} />
          )}
        </FormContext.Consumer>
      );
    }
  }
  return Comp;
}

export default FormContext;

import React from 'react';
import createReactContext from 'create-react-context';
import { FieldByName, FormInterface } from '../types';

type FormContextValue = {
  fields: FieldByName
} | undefined

const FormContext: createReactContext.Context<FormContextValue> = createReactContext<FormContextValue>(undefined);

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

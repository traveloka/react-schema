import * as React from 'react';
import FieldComponent from '../Field';

export default function createField(WrapperComponent: React.ComponentClass<any, any>) {
  const Field = class extends React.Component<any, any> {
    public render() {
      return (
        <FieldComponent
          component={WrapperComponent}
          {...this.props}
        />
      );
    }
  };
  return Field;
}

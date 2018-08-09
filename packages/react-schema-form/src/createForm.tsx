import * as React from 'react';
import {
  KeyedEntity,
  getEntityProps,
  getReactEntityComponent,
  createSchema
} from '@traveloka/react-schema';
import { Field } from './Field';
import { ValidationResult } from '../node_modules/@traveloka/validation';

type FieldByName = {
  [name: string]: Field,
}

export function createForm(schemaEntity: KeyedEntity): React.ComponentClass<any> {
  const Component = class FormComponent extends React.Component<any> {
    public fields: FieldByName = {};

    public render() {
      const formEntity: KeyedEntity = {};
      Object.entries(schemaEntity).map(([name, fieldComponent]) => {
        const FieldComponent = getReactEntityComponent(fieldComponent);
        const { defaultValue, rules, ...fieldProps } = getEntityProps(fieldComponent);
        formEntity[name] = {
          component: Field,
          name,
          defaultValue,
          rules,
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

    public validate = ():{[name: string]: ValidationResult} => {
      return Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.fields[name].validate(),
      }), {})
    }

    public getValues = ():{[name: string]: any} => {
      return Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.getValue(name),
      }), {})
    }
  }
  return Component;
}

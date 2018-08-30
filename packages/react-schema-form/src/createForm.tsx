import * as React from 'react';
import {
  KeyedEntity,
  getEntityProps,
  getReactEntityComponent,
  createSchema
} from '@traveloka/react-schema';
import { Field } from './Field';
import { ValidationResultByName, FormInterface, FormFieldInterface, FormFieldValidationResult } from './types';

type FieldByName = {
  [name: string]: FormFieldInterface,
}

type FormProps = {
  onChangeField: (name: string, value: any) => void,
}

const K_FORM_TYPE = 'REACT_SCHEMA_FORM';

export function createForm(schemaEntity: KeyedEntity): React.ComponentClass<any> {
  const Component = class FormComponent extends React.Component<FormProps> implements FormInterface {
    public static type:string = K_FORM_TYPE;

    public fields: FieldByName = {};
    private SchemaComponent: React.ComponentClass<any, any>;

    constructor(props: FormProps) {
      super(props);
      const formEntity: KeyedEntity = {};
      Object.entries(schemaEntity).map(([name, fieldComponent]) => {
        const entityComponent: React.ComponentClass<any>  = getReactEntityComponent(fieldComponent);
        const entityProps: {[key: string]: any} = getEntityProps(fieldComponent);
        formEntity[name] = this.constructComponent(name, entityComponent, entityProps);
      });
      this.SchemaComponent = createSchema(formEntity);
    }

    public render() {
      return (
        <this.SchemaComponent
          ref={(el: any) => {
            this.fields = el && el.entities;
          }}
        />
      )
    }

    public getValueField = (name : string): any => {
      return this.fields[name].getValue();
    }
    public getValue = ():{[name: string]: any} => {
      return Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.getValueField(name),
      }), {})
    }
    public getValues = () => this.getValue();

    public setValueField = (name: string, value: any): any => {
      return this.fields[name].setValue(value);
    }
    public setValue = (values: {[name: string]: any}): any => {
      Object.entries(values).map(([name, value]) => this.setValueField(name, value));
      return this.getValues();
    }
    public setValues = (values: {[name: string]: any}): any => this.setValue(values);

    public getErrorField = (name: string): FormFieldValidationResult => {
      return this.fields[name].getError();
    }
    public getError = (): ValidationResultByName => {
      const errors = Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.getErrorField(name),
      }), {});
      if (Object.values(errors).filter(Boolean).length === 0) return null;
      return errors;
    }
    public getErrors = (): ValidationResultByName => this.getError();

    public setErrorField = (name: string, error: FormFieldValidationResult): FormFieldValidationResult => {
      return this.fields[name].setError(error);
    }
    public setError = (errors: ValidationResultByName): any => {
      if (!errors) return null;
      Object.entries(errors).map(([name, error]) => this.setErrorField(name, error));
      return this.getErrors();
    }
    public setErrors = (errors:  ValidationResultByName): any => this.setError(errors);

    public validateField = (name: string): FormFieldValidationResult => {
      return this.fields[name].validate();
    }
    public validate = (): ValidationResultByName => {
      const errors = Object.keys(schemaEntity).reduce((values, name) => ({
        ...values,
        [name]: this.validateField(name),
      }), {});
      if (Object.values(errors).filter(Boolean).length === 0) return null;
      return errors;
    }

    public reset = (): void => {
      Object.keys(schemaEntity).forEach(fieldName => {
        this.fields[fieldName].reset();
      })
    }

    private isFormClass(entityComponent: any): entityComponent is typeof FormComponent {
      if ('type' in entityComponent as any) {
        return entityComponent.type === K_FORM_TYPE;
      }
      return false;
    }

    private constructComponent = (name:string , entityComponent: React.ComponentClass<any, any>, entityFields: {[key: string]: any}) => {
      if (this.isFormClass(entityComponent)) return this.constructFormComponent(name, entityComponent, entityFields);
      return this.constructFieldComponent(name, entityComponent, entityFields);
    }

    private constructFormComponent = (name: string, formComponent: React.ComponentClass<any, any>, props: {[key: string]: any}) => {
      return {
        component: formComponent,
        onChangeField: (fieldName: any, fieldValue: any) => this.props.onChangeField && this.props.onChangeField(`${name}.${fieldName}`, fieldValue),
        ...props,
      }
    }

    private constructFieldComponent = (name: string, fieldComponent: React.ComponentClass<any, any>, props: {[key: string]: any}) => {
      const { defaultValue, rules, revalidateOnError = true, validateOnChange = false, ...fieldProps } = props;
      return {
        component: Field,
        onChange: (v:any) => this.props.onChangeField && this.props.onChangeField(name, v),
        revalidateOnError,
        validateOnChange,
        rules,
        defaultValue,
        name,
        fieldProps,
        fieldComponent
      };
    }

  }
  return Component;
}

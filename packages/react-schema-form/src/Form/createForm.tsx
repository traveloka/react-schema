import * as React from 'react';
import {
  KeyedEntity,
  getEntityProps,
  getReactEntityComponent,
  createSchema
} from '@traveloka/react-schema';
import createField from '../Field/createField';
import { FormFieldInterface, FormInterface } from '../types';
import FormComponent from '../Form';

type FieldByName = {
  [name: string]: FormFieldInterface,
}

type FormProps = {
  children: any,
  onChangeField: (name: string, value: any) => void
  fieldRef: (ref: FormInterface) => FormInterface
  name?: string
}

const K_FORM_TYPE = 'REACT_SCHEMA_FORM';

export function createForm(schemaEntity: KeyedEntity): React.ComponentClass<any> {
  const Component = class SchemaFormComponent extends React.Component<FormProps> {
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
        <FormComponent
          fieldRef={this.props.fieldRef}
          name={this.props.name}
        >
          {(state: any) => this.handleRenderChildren(state)}
        </FormComponent>
      )
    }

    private handleRenderChildren = (state: any[]) => {
      const form = <this.SchemaComponent/>;
      if (!this.props.children) return form;
      if (typeof this.props.children === 'function') {
        return this.props.children({
          form,
          ...state
        });
      }
      return this.props.children;
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
        name: name,
        ...props,
      }
    }

    private constructFieldComponent = (name: string, fieldComponent: React.ComponentClass<any, any>, props: {[key: string]: any}) => {
      return {
        component: createField(fieldComponent),
        onChange: (v:any) => this.props.onChangeField && this.props.onChangeField(name, v),
        name,
        ...props
      };
    }

  }
  return Component;
}

import * as React from 'react';

export type ObjectComponent = {
  component: ComponentEntity,
  [prop: string]: any,
}

export type ComponentEntity = React.ComponentClass<any, any> | ObjectComponent;

export type KeyedEntity = {
  [id: string]: ComponentEntity,
};

export type EntityElementById = {
  [id: string]: any,
}

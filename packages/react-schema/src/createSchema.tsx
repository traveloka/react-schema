import * as React from 'react';
import {
  Schema,
  SchemaProps,
  EntityElementById,
  KeyedEntity,
} from './types';

import { getReactEntityComponent, getEntityProps } from './utils/entity';

export function createSchema(entity: KeyedEntity): Schema {
  const Component = class SchemaComponent extends React.Component<SchemaProps> {
    public entities: EntityElementById;

    constructor(props: any) {
      super(props);
      this.entities = {};
    }

    public render() {
      return Object.entries(entity).map(([id, entityComponent]) => {
        const REntityComponent = getReactEntityComponent(entityComponent);
        const props = getEntityProps(entityComponent);
        return (
          <REntityComponent
            key={id}
            {...props}
            ref={(el) => {
              this.entities[id] = el
            }}
          />
        );
      });
    }
  };
  return Component;
}

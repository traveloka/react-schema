import * as React from 'react';
import { ComponentEntity, ObjectComponent } from "../types";

function isObjectComponent(entity: ComponentEntity): entity is ObjectComponent {
  return 'component' in entity;
}

export function getReactEntityComponent(entity: ComponentEntity): React.ComponentClass<any> {
  if (isObjectComponent(entity)) return getReactEntityComponent(entity.component);
  return entity;
}

export function getEntityProps(entity: ComponentEntity): {[key:string]: any} {
  if (isObjectComponent(entity)) {
    const { component, ...props } = entity;
    return props;
  };
  return {};
}

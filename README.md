# React Schema Monorepo
[![CircleCI](https://circleci.com/gh/traveloka/react-schema/tree/master.svg?style=shield&circle-token=8bed162ba9fecd913bca0405662308267269d009)](https://circleci.com/gh/traveloka/react-schema)
## Packages
1. [React Schema](./packages/react-schema/README.md)
2. [React Schema Form](./packages/react-schema-form/README.md)
3. [Validation](./packages/validation/README.md)

## Motivation
Form is common in any application. The final result of form is data. This library would separate the UI and Form logic by giving basic API to Field Component. The flow how to get the data, would be the responsible of the Field Component.

Inspired by Server Driven Rendering Framework where certain format and standard commands being able to render particular screen layout, this capability will enhance form creation and usage not to mention we might able to send the form definition from server in future. Sharing most of the things related to form creation can simplify the process.

## Installation
yarn
```
yarn add @traveloka/react-schema-form
```
npm
```
npm i @traveloka/react-schema-form --save
```

## Caveats
this library provides no UI component, you can map your component and the definition

```
import { createForm } from '@traveloka/react-schema-form';
import { DRNInputField } from '@traveloka/district-ui';

const Form = createForm({
  email: Input,
  age: Input,
});

```

# React Schema

## Installation
yarn
```
yarn add @traveloka/react-schema-form
```
npm
```
npm i @traveloka/react-schema-form --save
```

## Motivation
Form is common in any application. The final result of form is data. This library would separate the UI and Form logic by giving basic API to Field Component. The flow how to get the data, would be the responsible of the Field Component.

## Getting Started

### Basic Usage

```javascript
// InputField.js

import React from 'react';

export default function InputField({ onChange, value, ...rest }) {
  return (
    <input onChange={(e) => onChange(e.target.value)} value={value} {...rest} />
  );
}
```

```javascript
// LoginForm.js

import React from 'react';
import { Form, Field } from '@traveloka/react-schema-form';  // ES6
import InputField from './InputField';

export default class LoginForm extends React.Component {

  form = null;

  render() {
    return (
      <React.Fragment>
        <Form fieldRef={(el) => form = el}>
          <Field name="email" component={InputField} />
          <Field name="password" component={InputField} type="password"/>
        </Form>
        <button onClick={this.handleSubmit}>Submit</button>
      </React.Fragment>
    );
  }

  handleSubmit = () => {
    this.props.onSubmit(this.form.getValues());
  }
}
```

## Documentation

### - Field

#### Importing
```javascript
var Field = require('@traveloka/react-schema-form').Field;  // ES5

import { Field } from '@traveloka/react-schema-form';  // ES6
```

#### Props
| Property          | Type                 | Default Value    | Description                              |
| ----------------- | -------------------- | ---------------- | ---------------------------------------- |
| name              | string               | none             | required                                 |
| fieldRef          | React.createRef      | none             | to be able access field methods.         |
| component         | React.ClassComponent | none             | required                                 |
| revalidateOnError | boolean              | true             | will auto validate when have an error    |
| validateOnChange  | boolean              | false            | will auto validate when value is changes |
| normalize         | function             | (value) => value | will serialize the value                 |
| defaultValue      | any                  |                  | default value.                           |
| rules             | func                 | array of func    |                                          |  |

#### Methods

| Methods                                                 | Description                                              |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `getValue() => any`                                     | return current field value                               |
| `setValue(newValue: any) => any`                        | set current field value                                  |
| `getError() => ValidationResult`                        | return current field error message                       |
| `setError(error: ValidationResult) => ValidationResult` | set current field error                                  |
| `validate() => ValidationResult`                        | trigger field to validate                                |
| `reset() => void`                                       | reset field to defaultValue, and remove error            |
| `initialize(value: any) => any`                         | set field defaultValue                                   |
| `getDefaultValue() => any`                              | get field defaultValue                                   |
| `hasError() => boolean`                                 | return true if field have an error                       |
| `isDirty() => boolean`                                  | return true if field value is not same with defaultValue |

#### Given Props to Field Component


| Methods                | Description                         |
| ---------------------- | ----------------------------------- |
| `name: String`         | the Field name                      |
| `label: String`        | UC Words of name                    |
| `isDirty: Boolean`     | state of the changes value of field |
| `error: String | null` | field error                         |
| `onChange: (v) => any` | function to change field value      |
| `value: any`           | the value of field                  |

#### Usage
##### 1. A Component
This can be any component class that you have written or have imported from a third party library.
```javascript
/// MyCustomInput.js
import React, { Component } from 'react'

class MyCustomInput extends Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    isDirty: PropTypes.bool,
    error: PropTypes.string,
  }

  render() {
    const { value, onChange } = this.props
    return (
      <div>
        <span>The current value is {value}.</span>
        <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
        <button type="button" onClick={() => onChange(value - 1)}>Dec</button>
      </div>
    )
  }
}
```

Then, somewhere in your form...

```javascript
import MyCustomInput from './MyCustomInput'
...
<Field name="myField" component={MyCustomInput}/>
```

##### 2. Validation
`Field` accept `rules` as props. Rules can be a function / array of function. Each function accept one arguments, the value. The function just need to return null / string. The return value would be the error message for the field component (eg: if there's no error, return `null`).

```javascript
// MyErrorableInput.js

import React from 'react';

export default function MyErrorableInput({ value, onChange, error, ...rest }) {
  return (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      {!!error && <div className="error">{error}</div>}
    </div>
  );
}
```

For rule functions
```javascript
// isEmail.js
export default function isEmail(value) {
  return value.contains('@') ? null : `${value} is not an email format.`;
}

// maxLength.js
const maxLength = (length) => (value) => {
  return value && value.length <= length ? null : `Length must not exceed ${length} chars.`;
}
```
Then somewhere in your form...
```javascript
import isEmail from './isEmail';
import maxLength from './maxLength';
import MyErrorableInput from './MyErrorableInput';

<Field name="email" component={MyCustomInput} rules={[isEmail, maxLength(10)]}>
```
### - Form

#### Props

| Property  | Type            | Default Value | Description                               |
| --------- | --------------- | ------------- | ----------------------------------------- |
| array     | boolean         | false         | would return the values as array          |
| normalize | function        | (val) => val  | a function that normalize the form values |
| fieldRef  | React.createRef | none          | to be able access field methods.          |


#### Methods

| Methods                                                                         | Description                                                    |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `getValue() => ValueByFieldName`                                                | return form value by fieldName                                 |
| `setValue(newValue: ValueByFieldName) => ValueByFieldName`                      | set form value by fieldName                                    |
| `getError() => ValidationResultByFieldName`                                     | return form error message by fieldName                         |
| `setError(error: ValidationResultByFieldName) => ValidationResultByFieldName`   | set form error by fieldName                                    |
| `validate() => ValidationResultByFieldName`                                     | trigger form to validate                                       |
| `reset() => void`                                                               | reset form to defaultValue, and remove error                   |
| `initialize(value: ValueByFieldName) => any`                                    | set form defaultValue by fieldName                             |
| `getDefaultValue() => ValueByFieldName`                                         | get defaultValue by fieldName                                  |
| `hasError() => boolean`                                                         | return true if some field have an error                        |
| `hasErrorField(fieldName: string) => boolean`                                   | return true if field have an error                             |
| `isDirty() => boolean`                                                          | return true if some field value is not same with defaultValue  |
| `isDirtyField(fieldName: string) => boolean`                                    | return true if field value is not same with field defaultValue |
| `getValueField(fieldName: string) => any`                                       | return field value                                             |
| `setValueField(fieldName: string, value: any) => any`                           | set field value                                                |
| `getErrorField(fieldName: string) => ValidationResult`                          | return field error message                                     |
| `setErrorField(fieldName: string, error: ValidationResult) => ValidationResult` | set field error message                                        |
| `validateField(fieldName: string) => ValidationResult`                          | validate specify field                                         |

#### Children Function Params

| Property | Type                             | Description                                            |
| -------- | -------------------------------- | ------------------------------------------------------ |
| values   | [name: string]: any              | form value by fieldName                                |
| isDirty  | boolean                          | true if some field value is not same with defaultValue |
| hasError | boolean                          | true if some field have an error                       |
| error    | [name: string]: ValidationResult | form error message by fieldName                        |

## Nested Forms
You could also build a nested form like this
```jsx
<Form fieldRef={form => this.form = form}>
  <div>
    <Field name="email" component={InputField} />
    <Form name="profile">
      <Field name="first" component={InputField} />
      <Field name="last" component={InputField} />
    </Form>
  </div>
</Form>

// when you get value
this.form.getValue()
{
  email: ...,
  profile: {
    first: ...,
    last: ...
  }
}
```

## Playground
- Example 1
[![Edit [@traveloka/react-schema-form] #1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k2n8w2vopo)
- Example 2
[![Edit [@traveloka/react-schema-form] #2](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/yr61y1xjv)

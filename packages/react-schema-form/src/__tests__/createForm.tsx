import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { createForm } from '../createForm';

describe('test createForm', () => {
  it('should able render component', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: Input
    });
    const testRenderer = TestRenderer.create(
      <Form />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(Input)).toBeTruthy();
  });

  it('should able render component as object', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: {
        component: Input
      }
    });
    const testRenderer = TestRenderer.create(
      <Form />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(Input)).toBeTruthy();
  });

  it('should have pass fieldProps, and fieldComponent', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: {
        component: Input,
        defaultValue: 'test',
      },
    });
    const testRenderer = TestRenderer.create(
      <Form />
    );
    const testInstance = testRenderer.root;
    let FieldEl = null;
    FieldEl = testInstance.findByProps({
      fieldComponent: Input
    });
    expect(FieldEl).toBeTruthy();
    FieldEl = testInstance.findByProps({
      defaultValue: 'test'
    });
    expect(FieldEl).toBeTruthy();
  });

  it('should able get value of field', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: {
        component: Input,
        defaultValue: 'test',
      },
      age: {
        component: Input,
        defaultValue: 12,
      }
    });
    let form = null;
    TestRenderer.create(
      <Form ref={el => form = el} />
    );
    expect(form.getValue('email')).toEqual('test');
    expect(form.getValue('age')).toEqual(12);
    expect(form.getValues()).toMatchObject({
      email: 'test',
      age: 12,
    });
  });

  it('should validate all fields', () => {
    const invalid = () => 'invalid';
    const valid = () => null;
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: {
        component: Input,
        rules: invalid
      },
      age: {
        component: Input,
        rules: [valid, valid]
      }
    });
    let form = null;
    TestRenderer.create(
      <Form ref={el => form = el} />
    );
    const result = form.validate();
    expect(result).toMatchObject({
      email: 'invalid',
      age: null,
    });
  });
});

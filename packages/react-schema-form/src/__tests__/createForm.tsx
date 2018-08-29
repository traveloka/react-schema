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

  it('[props] should have pass fieldProps, and fieldComponent', () => {
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

  it('[props] should trigger onChange for given field', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: Input,
      age: Input,
    });
    let form = null;
    const onChangeMock = jest.fn();
    TestRenderer.create(
      <Form
        ref={el => form = el}
        onChangeField={onChangeMock}
      />
    );
    form.fields['email'].setValue('jacky.wijaya@traveloka.com');
    form.fields['age'].setValue(17);
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenCalledWith('email', 'jacky.wijaya@traveloka.com');
    expect(onChangeMock).toHaveBeenCalledWith('age', 17);
  });

  it('[instance] getValue and getValues should be working as expected', () => {
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

  it('[instance] should validate all fields', () => {
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
    const errors = form.getErrors();
    expect(result).toMatchObject({
      email: 'invalid',
      age: null,
    });
    expect(result).toMatchObject({
      email: 'invalid',
      age: null,
    });
  });


  it('[instance] validate should return null when all fields is valid', () => {
    const valid = () => null;
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: {
        component: Input,
        rules: valid
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
    expect(result).toBeFalsy();
  });

  it('[instance] setValue, setValues, getValue, getValues should work as expected', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: Input,
      age: Input,
    });
    let form = null;
    TestRenderer.create(
      <Form
        ref={el => form = el}
      />
    );
    form.fields['email'].setValue('jacky.wijaya@traveloka.com');
    form.fields['age'].setValue(17);
    expect(form.fields['email'].getValue()).toEqual('jacky.wijaya@traveloka.com');
    expect(form.fields['age'].getValue()).toEqual(17);
    expect(form.getValues()).toMatchObject({
      email: 'jacky.wijaya@traveloka.com',
      age: 17,
    });
    form.setValues({
      age: 21,
    });
    expect(form.getValues()).toMatchObject({
      email: 'jacky.wijaya@traveloka.com',
      age: 21,
    });
  });

  it('[instance] setError, setErrors, getError, and getErrors should work as expected', () => {
    class Input extends React.Component {
      public render() {
        return <input {...this.props} />
      }
    }
    const Form = createForm({
      email: Input,
      age: Input,
    });
    let form = null;
    TestRenderer.create(
      <Form
        ref={el => form = el}
      />
    );
    form.fields['email'].setError('required');
    form.fields['age'].setError('not empty');
    expect(form.fields['email'].getError()).toEqual('required');
    expect(form.fields['age'].getError()).toEqual('not empty');
    expect(form.getErrors()).toMatchObject({
      email: 'required',
      age: 'not empty',
    });
    form.setErrors({
      email: null,
      age: 'required',
    });
    expect(form.getErrors()).toMatchObject({
      email: null,
      age: 'required',
    });
    form.setErrors({
      email: null,
      age: null,
    });
    expect(form.getErrors()).toEqual(null);
  });
});

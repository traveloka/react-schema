import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { Field } from '../Field';


class FieldComponent extends React.Component {
  public render() {
    return <input {...this.props} />
  }
}

describe('test Field Component', () => {
  it('should render fieldComponent props', () => {
    const testRenderer = TestRenderer.create(
      <Field fieldComponent={FieldComponent} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent)).toBeTruthy();
  });

  it('should pass fieldProps to fieldComponents', () => {
    const testRenderer = TestRenderer.create(
      <Field fieldComponent={FieldComponent} fieldProps={{hello: 'World'}} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent).props.hello).toEqual('World');
  });

  it('should have expected value and error', () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        ref={el => field = el}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.value).toBeFalsy();
    fieldComponent.props.onChange('new value');
    field.setError('new error');
    expect(fieldComponent.props.value).toEqual('new value');
    expect(fieldComponent.props.error).toEqual('new error');
    field.reset();
    expect(fieldComponent.props.value).toBeFalsy();
    expect(fieldComponent.props.error).toBeFalsy();
    expect(field.getValue()).toBeFalsy();
    expect(field.getError()).toBeFalsy();
  });


  it('should have expected value from default value', () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        defaultValue='test'
        ref={el => field = el}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.value).toEqual('test');
    field.reset();
    expect(fieldComponent.props.value).toBeFalsy();
  });

  it('should have expected error', () => {
    const rule = () => 'invalid';
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        rules={rule}
        ref={el => field = el}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.error).toBeFalsy();
    field.validate();
    expect(fieldComponent.props.error).toEqual('invalid');
    field.reset();
    expect(fieldComponent.props.error).toBeFalsy();
  });

  it('should have no error with empty rule', () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        ref={el => field = el}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.error).toBeFalsy();
    field.validate();
    expect(fieldComponent.props.error).toBeFalsy();
  });

  it('should have onChange callback', () => {
    let field = null;
    const onChangeMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        ref={el => field = el}
        onChange={onChangeMock}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    field.setValue('test');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should rules must be passed with value', () => {
    const rule = jest.fn();
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        rules={rule}
        ref={el => field = el}
      />
    );
    field.setValue('test');
    field.validate();
    expect(rule).toBeCalledWith('test');
  });

  it('should rules must be passed with value (array)', () => {
    const rule = jest.fn();
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        rules={[rule]}
        ref={el => field = el}
      />
    );
    field.setValue('test');
    field.validate();
    expect(rule).toBeCalledWith('test');
  });

  it('[props] value, should use value from props', () => {
    let field = null;
    const onChangeMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <Field
        fieldComponent={FieldComponent}
        value={'test-value'}
        ref={el => field = el}
        onChange={onChangeMock}
      />
    );
    expect(field.getValue()).toEqual('test-value');
    field.setValue('new-value');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toBeCalledWith('new-value');
  });
});

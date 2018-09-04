import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Field from '../../Field';


class FieldComponent extends React.Component {
  public render() {
    return <input {...this.props} />
  }
}

describe('test Field Component', () => {
  it('should render fieldComponent props', () => {
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent)).toBeTruthy();
  });

  it('should pass fieldProps to fieldComponents', () => {
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} hello="World" />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent).props.hello).toEqual('World');
  });

  it('should have expected value and error', () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => {
          field = el;
        }}
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
        component={FieldComponent}
        defaultValue='test'
        fieldRef={el => field = el}
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
        component={FieldComponent}
        rules={rule}
        fieldRef={el => field = el}
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
        component={FieldComponent}
        fieldRef={el => field = el}
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
        component={FieldComponent}
        fieldRef={el => field = el}
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
        component={FieldComponent}
        rules={rule}
        fieldRef={el => field = el}
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
        component={FieldComponent}
        rules={[rule]}
        fieldRef={el => field = el}
      />
    );
    field.setValue('test');
    field.validate();
    expect(rule).toBeCalledWith('test');
  });

  it('[props] revalidateOnError, should auto validate when error and value is changed', () => {
    let field = null;
    const rule = (value) => value !== 'key' ? 'invalid' : null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        revalidateOnError={true}
        fieldRef={el => field = el}
        rules={rule}
      />
    );
    expect(field.getError()).toBeFalsy();
    field.setValue('new-value');
    expect(field.getError()).toBeFalsy();
    field.validate();
    expect(field.getError()).toEqual('invalid');
    field.setValue('key');
    expect(field.getError()).toBeFalsy();
  });

  it('[props] validateOnChange, should auto validate when value is changed', () => {
    let field = null;
    const rule = (value) => value !== 'key' ? 'invalid' : null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        validateOnChange={true}
        fieldRef={el => field = el}
        rules={rule}
      />
    );
    expect(field.getError()).toBeFalsy();
    field.setValue('new-value');
    expect(field.getError()).toEqual('invalid');
    field.setValue('key');
    expect(field.getError()).toBeFalsy();
  });
});

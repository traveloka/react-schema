import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import FormComponent from '../index';
import Field from '../../Field';

class Input extends React.Component<any, any> {
  public render() {
    return <input {...this.props}/>
  }
}

describe('test Form', () => {
  describe('test render', () => {
    it('should able render without name', () => {
      const testRenderer = TestRenderer.create(
        <FormComponent />
      );
      const testInstance = testRenderer.root;
      expect(testInstance.findByType(FormComponent)).toBeTruthy();
    });
  });

  describe('test children as function', () => {
    it('should pass isDirty and hasError', () => {
      const testRenderer = TestRenderer.create(
        <FormComponent>
          {(state) => (
            <Input {...state} />
          )}
        </FormComponent>
      );
      const testInstance = testRenderer.root;
      expect(testInstance.findByProps({
        isDirty: false,
        hasError: false,
      })).toBeTruthy();
    });
  });

  describe('test notifyOnChange', () => {
    it('should call notifyOnChange when field is setValue', () => {
      let form = null;
      const testRenderer = TestRenderer.create(
        <FormComponent fieldRef={(el) => form = el}>
          {(state) => (
            <Field name="email" component={Input} {...state} />
          )}
        </FormComponent>
      );
      const testInstance = testRenderer.root;
      const inputEl = testInstance.findByType(Input);
      inputEl.props.onChange('new value');
      expect(form.state.isDirty).toEqual(true);
    });
  });
});

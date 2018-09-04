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
      class Button extends React.Component {
        public render() {
          return null;
        }
      }
      const testRenderer = TestRenderer.create(
        <FormComponent fieldRef={(el) => form = el}>
          {(state) => (
            <>
              <Field name="email" component={Input}/>
              <Button {...state}/>
            </>
          )}
        </FormComponent>
      );
      const testInstance = testRenderer.root;
      const inputEl = testInstance.findByType(Input);
      const buttonEl = testInstance.findByType(Button);
      inputEl.props.onChange('new value');
      expect(buttonEl.props.isDirty).toEqual(true);
      expect(buttonEl.props.hasError).toEqual(false);
      form.setValue({
        email: undefined,
      });
      expect(buttonEl.props.isDirty).toEqual(false);
      expect(buttonEl.props.hasError).toEqual(false);
    });
  });
});

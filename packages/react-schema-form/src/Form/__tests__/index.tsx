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

  it('hasError should true when field is error', () => {
    let form = null;
    class Button extends React.Component {
      public render() {
        return null;
      }
    }
    const rule = (value) => {
      return value !== 'key' ? 'invalid' : null;
    }
    const testRenderer = TestRenderer.create(
      <FormComponent fieldRef={(el) => form = el}>
        {(state) => (
          <>
            <Field name="email" rules={rule} component={Input}/>
            <Button {...state}/>
          </>
        )}
      </FormComponent>
    );
    const testInstance = testRenderer.root;
    const inputEl = testInstance.findByType(Input);
    const buttonEl = testInstance.findByType(Button);
    inputEl.props.onChange('new value');
    form.validate();
    expect(buttonEl.props.isDirty).toEqual(true);
    expect(buttonEl.props.hasError).toEqual(true);
    form.setValue({
      email: 'key',
    });
    expect(buttonEl.props.isDirty).toEqual(true);
    expect(buttonEl.props.hasError).toEqual(false);
  });

  it('[children function] should rerender and give new value', () => {
    let form = null;
    class InputField extends React.Component<any> {
      public render() {
        return null;
      }
    }
    class TComp extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    const testRenderer = TestRenderer.create(
      <FormComponent fieldRef={(el) => form = el}>
        {(state) => (
          <>
            <Field name="email" component={InputField}/>
            <TComp title={state.values.email}/>
          </>
        )}
      </FormComponent>
    );
    const testInstance = testRenderer.root;
    const inputEl = testInstance.findByType(InputField).instance;
    const textEl = testInstance.findByType(TComp).instance;
    inputEl.props.onChange('new value');
    expect(textEl.props.title).toEqual('new value');
    inputEl.props.onChange('new');
    expect(textEl.props.title).toEqual('new');
  });



  it('[children function] defaultValue should be passed to values', () => {
    let form = null;
    class InputField extends React.Component<any> {
      public render() {
        return null;
      }
    }
    class TComp extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    const testRenderer = TestRenderer.create(
      <FormComponent fieldRef={(el) => form = el}>
        {(state) => (
          <>
            <Field name="email" component={InputField} defaultValue="traveloka"/>
            <TComp title={state.values.email}/>
          </>
        )}
      </FormComponent>
    );
    const testInstance = testRenderer.root;
    const textEl = testInstance.findByType(TComp).instance;
    expect(textEl.props.title).toEqual('traveloka');
  });

  it('[nested form] able to have nested forms', () => {
    let form = null;
    class EmailField extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    class FirstField extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    class LastField extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    class TComp extends React.Component<{ title: string }> {
      public render() {
        return null;
      }
    }
    const testRenderer = TestRenderer.create(
      <FormComponent fieldRef={(el) => form = el}>
        {(state) => (
          <>
            <Field name="email" component={EmailField}/>
            <FormComponent name="profile">
              <>
                <Field name="first" component={FirstField}/>
                <Field name="last" component={LastField}/>
              </>
            </FormComponent>
            <TComp {...state}/>
          </>
        )}
      </FormComponent>
    );
    const testInstance = testRenderer.root;
    const emailEl = testInstance.findByType(EmailField).instance;
    const firstEl = testInstance.findByType(FirstField).instance;
    const lastEl = testInstance.findByType(LastField).instance;
    emailEl.props.onChange('jacky.wijaya@traveloka.com');
    firstEl.props.onChange('jacky');
    lastEl.props.onChange('wijaya');

    expect(form.getValue()).toMatchObject({
      email: 'jacky.wijaya@traveloka.com',
      profile: {
        first: 'jacky',
        last: 'wijaya'
      }
    });
    const dataEl = testInstance.findByType(TComp).instance;
    expect(dataEl.props.values).toMatchObject({
      email: 'jacky.wijaya@traveloka.com',
      profile: {
        first: 'jacky',
        last: 'wijaya'
      }
    });
  });
});

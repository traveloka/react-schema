import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { createForm } from '../createForm';

describe('test createForm', () => {
  describe('test render entity component', () => {

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

    it('value should not gone', () => {

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
      class Container extends React.Component<any, any> {
        public state = {
          counter: 1
        }
        public render() {
          return (
            <div>
              <Form />
            </div>
          );
        }
      }
      const testRenderer = TestRenderer.create(
        <Container />
      );
      const testInstance = testRenderer.root;
      let inputInstance = testInstance.findByType(Input);
      inputInstance.props.onChange('value');
      expect(inputInstance.props.value).toEqual('value');
      const containerInstance = testInstance.findByType(Container).instance;
      containerInstance.setState({ counter: 2 });
      expect(inputInstance.props.value).toEqual('value');
    });
  });

  describe('test field component', () => {

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
      FieldEl = testInstance.findByType(Input);
      expect(FieldEl).toBeTruthy();
      FieldEl = testInstance.findByProps({
        defaultValue: 'test'
      });
      expect(FieldEl).toBeTruthy();
    });

    it('[props] should pass revalidateOnError and validateOnChange', () => {
      class Input extends React.Component {
        public render() {
          return <input {...this.props} />
        }
      }
      const Form = createForm({
        email: {
          component: Input,
          defaultValue: 'test',
          revalidateOnError: true,
          validateOnChange: true,
        },
      });
      const testRenderer = TestRenderer.create(
        <Form />
      );
      const testInstance = testRenderer.root;
      let FieldEl = null;
      FieldEl = testInstance.findByProps({
        revalidateOnError: true,
        validateOnChange: true,
      });
      expect(FieldEl).toBeTruthy();
    });
  });

  it('[props] should trigger onChangeField for given field', () => {
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
        fieldRef={el => form = el}
        onChangeField={onChangeMock}
      />
    );
    form.fields['email'].setValue('jacky.wijaya@traveloka.com');
    form.fields['age'].setValue(17);
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenCalledWith('email', 'jacky.wijaya@traveloka.com');
    expect(onChangeMock).toHaveBeenCalledWith('age', 17);
  });

  it('[instance] getValueField and getValues should be working as expected', () => {
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
      <Form fieldRef={el => form = el} />
    );
    expect(form.getValueField('email')).toEqual('test');
    expect(form.getValueField('age')).toEqual(12);
    expect(form.getValues()).toMatchObject({
      email: 'test',
      age: 12,
    });
    expect(form.getValue()).toMatchObject({
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
      <Form fieldRef={el => form = el} />
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
      <Form fieldRef={el => form = el} />
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
        fieldRef={el => form = el}
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
        fieldRef={el => form = el}
      />
    );
    form.setErrors();
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

  describe('test nested form', () => {
    it('[instance] should able handle setValues and getValues', () => {
      class Input extends React.Component {
        public render() {
          return <input {...this.props} />
        }
      }
      const Form = createForm({
        profile: createForm({
          name: Input,
          age: Input,
        }),
        additional: createForm({
          gender: Input,
          city: Input,
        })
      });
      let form = null;
      TestRenderer.create(
        <Form
          fieldRef={el => form = el}
        />
      );
      form.setValues({
        profile: {
          name: 'Bob',
          age: 17,
        },
        additional: {
          gender: 'Male',
          city: 'Jakarta'
        }
      });
      expect(form.fields['profile'].getValues()).toMatchObject({
        name: 'Bob',
        age: 17,
      })
    });

    it('[instance] should able handle reset', () => {
      class Input extends React.Component {
        public render() {
          return <input {...this.props} />
        }
      }
      const Form = createForm({
        profile: createForm({
          name: Input,
          age: Input,
        }),
        additional: createForm({
          gender: Input,
          city: Input,
        })
      });
      let form = null;
      TestRenderer.create(
        <Form
          fieldRef={el => form = el}
        />
      );
      form.setValues({
        profile: {
          name: 'Bob',
          age: 17,
        },
        additional: {
          gender: 'Male',
          city: 'Jakarta'
        }
      });
      expect(form.fields['profile'].getValues()).toMatchObject({
        name: 'Bob',
        age: 17,
      });
      form.reset();
      expect(form.getValues()).toMatchObject({
        profile: {
          name: null,
          age: null,
        },
        additional: {
          gender: null,
          city: null
        }
      });
    });

    it('[props] onChangeField should be trigger', () => {
      const onChangeMock = jest.fn();
      class Input extends React.Component {
        public render() {
          return <input {...this.props} />
        }
      }
      const Form = createForm({
        profile: createForm({
          name: Input,
          age: Input,
        }),
        additional: createForm({
          gender: Input,
          city: Input,
        })
      });
      let form = null;
      TestRenderer.create(
        <Form
          fieldRef={el => form = el}
          onChangeField={onChangeMock}
        />
      );
      form.setValues({
        profile: {
          name: 'Bob',
          age: 17,
        },
      });
      expect(onChangeMock).toHaveBeenCalledTimes(2);
      expect(onChangeMock).toBeCalledWith('profile.name', 'Bob');
      expect(onChangeMock).toBeCalledWith('profile.age', 17);
    });

    it('[props] value should be passed', () => {
      class Input extends React.Component {
        public render() {
          return <input {...this.props} />
        }
      }
      const Form = createForm({
        profile: createForm({
          name: Input,
          age: Input,
        }),
        additional: createForm({
          gender: Input,
          city: Input,
        })
      });
      let form = null;
      TestRenderer.create(
        <Form
          fieldRef={el => form = el}
          value={{
            profile: {
              name: 'Bob',
            },
            additional: {
              city: 'Jakarta',
            }
          }}

        />
      );
      form.getValues({
        profile: {
          name: 'Bob',
        },
        additional: {
          city: 'Jakarta',
        },
      });
    });
  });
});

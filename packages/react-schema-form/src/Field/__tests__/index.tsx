import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import Field from "../../Field";

class FieldComponent extends React.Component {
  public render() {
    return <input {...this.props} />;
  }
}

describe("test Field Component", () => {
  it("should render fieldComponent props", () => {
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent)).toBeTruthy();
  });

  it("should pass fieldProps to fieldComponents", () => {
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} hello="World" />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(FieldComponent).props.hello).toEqual(
      "World"
    );
  });

  it("should have expected value and error", () => {
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
    fieldComponent.props.onChange("new value");
    field.setError("new error");
    expect(fieldComponent.props.value).toEqual("new value");
    expect(fieldComponent.props.error).toEqual("new error");
    field.reset();
    expect(fieldComponent.props.value).toBeFalsy();
    expect(fieldComponent.props.error).toBeFalsy();
    expect(field.getValue()).toBeFalsy();
    expect(field.getError()).toBeFalsy();
  });

  it("[value boolean] should have expected value", () => {
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
    fieldComponent.props.onChange(true);
    expect(fieldComponent.props.value).toEqual(true);
    fieldComponent.props.onChange(false);
    expect(fieldComponent.props.value).toEqual(false);
  });

  it("should have expected value from default value", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        defaultValue="default value"
        fieldRef={el => (field = el)}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    fieldComponent.props.onChange("test");
    expect(fieldComponent.props.value).toEqual("test");
    field.reset();
    expect(fieldComponent.props.value).toEqual("default value");
  });

  it("should have expected error", () => {
    const rule = () => "invalid";
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        rules={rule}
        fieldRef={el => (field = el)}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.error).toBeFalsy();
    field.validate();
    expect(fieldComponent.props.error).toEqual("invalid");
    field.reset();
    expect(fieldComponent.props.error).toBeFalsy();
  });

  it("should have no error with empty rule", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} fieldRef={el => (field = el)} />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.error).toBeFalsy();
    field.validate();
    expect(fieldComponent.props.error).toBeFalsy();
  });

  it("should have onChange callback", () => {
    let field = null;
    const onChangeMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => (field = el)}
        onChange={onChangeMock}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    onChangeMock.mockReset();
    field.setValue("test");
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it("should rules must be passed with value", () => {
    const rule = jest.fn();
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        rules={rule}
        fieldRef={el => (field = el)}
      />
    );
    field.setValue("test");
    field.validate();
    expect(rule).toBeCalledWith("test");
  });

  it("should rules must be passed with value (array)", () => {
    const rule = jest.fn();
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        rules={[rule]}
        fieldRef={el => (field = el)}
      />
    );
    field.setValue("test");
    field.validate();
    expect(rule).toBeCalledWith("test");
  });

  it("[props] revalidateOnError, should auto validate when error and value is changed", () => {
    let field = null;
    const rule = value => (value !== "key" ? "invalid" : null);
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        revalidateOnError={true}
        fieldRef={el => (field = el)}
        rules={rule}
      />
    );
    expect(field.getError()).toBeFalsy();
    field.setValue("new-value");
    expect(field.getError()).toBeFalsy();
    field.validate();
    expect(field.getError()).toEqual("invalid");
    field.setValue("key");
    expect(field.getError()).toBeFalsy();
  });

  it("[props] validateOnChange, should auto validate when value is changed", () => {
    let field = null;
    const rule = value => (value !== "key" ? "invalid" : null);
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        validateOnChange={true}
        fieldRef={el => (field = el)}
        rules={rule}
      />
    );
    expect(field.getError()).toBeFalsy();
    field.setValue("new-value");
    expect(field.getError()).toEqual("invalid");
    field.setValue("key");
    expect(field.getError()).toBeFalsy();
  });

  it("[props] normalize", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => (field = el)}
        normalize={(value = "") =>
          (value.replace(/[^\d]/g, "").match(/.{1,3}/g) || []).join("-")
        }
      />
    );
    const testInstance = testRenderer.root;
    const fieldEl = testInstance.findByType(FieldComponent);
    fieldEl.props.onChange("12345");
    expect(fieldEl.props.value).toEqual("123-45");
    field.setValue("123-45678");
    expect(fieldEl.props.value).toEqual("123-456-78");
  });

  it("[props] normalize, defaultValue should be normalize", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => (field = el)}
        normalize={(value = "") =>
          (value.replace(/[^\d]/g, "").match(/.{1,3}/g) || []).join("-")
        }
        defaultValue="12345"
      />
    );
    const testInstance = testRenderer.root;
    const fieldEl = testInstance.findByType(FieldComponent);
    expect(fieldEl.props.value).toEqual("123-45");
    expect(fieldEl.props.isDirty).toEqual(false);
    field.setValue("123-45678");
    expect(fieldEl.props.value).toEqual("123-456-78");
    expect(fieldEl.props.isDirty).toEqual(true);
    expect(field.getDefaultValue()).toEqual("123-45");
  });

  it("[props] name, label", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field component={FieldComponent} name="test-name" label="label" />
    );
    const testInstance = testRenderer.root;
    const fieldEl = testInstance.findByType(FieldComponent);
    expect(fieldEl.props.name).toEqual("test-name");
    expect(fieldEl.props.label).toEqual("label");
  });

  it("[props] isDirty, isDirty should work as expected", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => {
          field = el;
        }}
        defaultValue="default-value"
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.value).toEqual("default-value");
    expect(fieldComponent.props.isDirty).toEqual(false);
    fieldComponent.props.onChange("new value");
    expect(fieldComponent.props.isDirty).toEqual(true);
    expect(fieldComponent.props.value).toEqual("new value");
    field.initialize("new value");
    expect(fieldComponent.props.isDirty).toEqual(false);
  });

  it("[props] isDirty, isDirty should work as expected (object value)", () => {
    let field = null;
    const testRenderer = TestRenderer.create(
      <Field
        component={FieldComponent}
        fieldRef={el => {
          field = el;
        }}
        defaultValue={{ first: "first name", last: "last name" }}
      />
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    expect(fieldComponent.props.value).toMatchObject({
      first: "first name",
      last: "last name"
    });
    expect(fieldComponent.props.isDirty).toEqual(false);
    fieldComponent.props.onChange({ first: "first name", last: "last name" });
    expect(fieldComponent.props.isDirty).toEqual(false);
    fieldComponent.props.onChange({
      first: "new first name",
      last: "last name"
    });
    expect(fieldComponent.props.isDirty).toEqual(true);
  });

  it("[props value] should using controlled value", () => {
    let field = null;
    class StateM extends React.Component {
      public render() {
        return this.props.children(this.state);
      }
    }
    const testRenderer = TestRenderer.create(
      <StateM>
        {value => (
          <Field
            component={FieldComponent}
            fieldRef={el => {
              field = el;
            }}
            value={value}
          />
        )}
      </StateM>
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    const stateComponent = testInstance.findByType(StateM);
    stateComponent.instance.setState({
      first: "first name"
    });
    expect(field.getValue()).toMatchObject({
      first: "first name"
    });
    stateComponent.instance.setState({
      first: "first name",
      last: "last name"
    });
    expect(field.getValue()).toMatchObject({
      first: "first name",
      last: "last name"
    });
  });

  it("[props value] should using controlled value (number)", () => {
    let field = null;
    class StateM extends React.Component {
      public render() {
        return this.props.children(this.state || {});
      }
    }
    const testRenderer = TestRenderer.create(
      <StateM>
        {({ value }) => (
          <Field
            component={FieldComponent}
            fieldRef={el => {
              field = el;
            }}
            value={value}
          />
        )}
      </StateM>
    );
    const testInstance = testRenderer.root;
    const fieldComponent = testInstance.findByType(FieldComponent);
    const stateComponent = testInstance.findByType(StateM);
    stateComponent.instance.setState({ value: 3 });
    expect(field.getValue()).toEqual(3);
    stateComponent.instance.setState({ value: 5 });
    expect(field.getValue()).toEqual(5);
  });

  it("[function getValue] should return the latest onChange value", () => {
    jest.useFakeTimers();
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
    fieldComponent.props.onChange(3);
    expect(field.getValue()).toEqual(3);
    jest.clearAllTimers();
  });
});

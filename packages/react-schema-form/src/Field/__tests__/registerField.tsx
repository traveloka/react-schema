import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Form from '../../Form/index';
import Field from '../index';

function TextInput() {
  return null;
}

describe('test registerField', () => {
  it('should removeField when unmount', () => {
    class Page extends React.Component {
      public state = {
        isShowLastNameField: true,
      }
      public render() {
        return (
          <Form fieldRef={this.props.fieldRef}>
            <Field name="name" component={TextInput} />
            {this.state.isShowLastNameField && <Field name="lastName" component={TextInput} />}
          </Form>
        );
      }
    }
    let form = null;
    const testRenderer = TestRenderer.create(
      <Page fieldRef={(el) => form = el}/>
    );
    const testInstance = testRenderer.root;
    const pageInstance = testInstance.findByType(Page).instance;
    form.setValueField('name', 'Jacky');
    form.setValueField('lastName', 'Wijaya');
    expect(form.getValue().lastName).toEqual('Wijaya');
    pageInstance.setState({ isShowLastNameField: false });
    expect(form.getValue().lastName).toBeFalsy();
    expect(form.state.values.lastName).toBeFalsy();
  });
});

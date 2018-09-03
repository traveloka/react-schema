import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import createField from '../createField';
import FieldComponent from '../index';

class Input extends React.Component {
  public render() {
    return null;
  }
}

describe('test createField', () => {
  it('should give component props', () => {
    const Field = createField(Input);
    const testRenderer = TestRenderer.create(
      <Field />
    );
    const testInstance = testRenderer.root;
    const fieldComponentInstance = testInstance.findByType(FieldComponent);
    expect(fieldComponentInstance.props.component).toEqual(Input);
  });
});

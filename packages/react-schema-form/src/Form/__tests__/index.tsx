import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import FormComponent from '../index';

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
});

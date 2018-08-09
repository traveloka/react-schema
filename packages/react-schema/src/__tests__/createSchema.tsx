import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { createSchema } from '../index';

describe('test createSchema', () => {
  it('should render correct element', () => {
    class HeaderComponent extends React.Component<any> {
      public render() {
        return <div />;
      }
    }
    class FooterComponent extends React.Component<any> {
      public render() {
        return <div />;
      }
    }
    const Schema = createSchema({
      header: HeaderComponent,
      footer: FooterComponent,
    });
    const testRenderer = TestRenderer.create(
      <Schema />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(HeaderComponent)).toBeTruthy();
    expect(testInstance.findByType(FooterComponent)).toBeTruthy();
  });

  it('should be able pass component as object', () => {
    class HeaderComponent extends React.Component<any> {
      public render() {
        return <div />;
      }
    }
    const Schema = createSchema({
      header: {
        component: HeaderComponent,
      },
    });
    const testRenderer = TestRenderer.create(
      <Schema />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(HeaderComponent)).toBeTruthy();
    expect(testInstance.findByType(HeaderComponent).props).toEqual({});
  });

  it('should be able pass props component in object', () => {
    class HeaderComponent extends React.Component<any> {
      public render() {
        return <div />;
      }
    }
    const Schema = createSchema({
      header: {
        component: HeaderComponent,
        marginTop: 8,
      },
    });
    const testRenderer = TestRenderer.create(
      <Schema />
    );
    const testInstance = testRenderer.root;
    expect(testInstance.findByType(HeaderComponent).props.marginTop).toEqual(8);
  });

  it('should be able access component function by ref', () => {
    let number = 1;
    class Button extends React.Component<any> {
      public incrementNumber() {
        number++;
      };
      public render() {
        return <div />;
      }
    }
    const Schema = createSchema({
      header: {
        component: Button,
      },
    });
    let schema = React.createRef<any>();
    const testRenderer = TestRenderer.create(
      <Schema
        ref={schema}
      />
    );
    expect(schema.current.entities).toBeTruthy();
    schema.current.entities['header'].incrementNumber();
    expect(number).toEqual(2);
  });
});

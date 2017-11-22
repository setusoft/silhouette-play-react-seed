// @flow
import * as React from 'react';

type Props = {
  onInit: () => void,
}

/**
 * A higher order component which allows to wrap a component and dispatch an `onInit` method before the
 * component will be mounted.
 *
 * @param Component The component to wrap.
 */
const initializer = (Component: React.Component<*>) =>
  class extends React.Component<Props> {

    /**
     * The component props.
     */
    props: Props;

    /**
     * Handler which is invoked immediately before mounting occurs.
     */
    componentWillMount() {
      this.props.onInit();
    }

    /**
     * Renders the component.
     *
     * @returns The component.
     */
    render() {
      const { onInit, ...rest } = this.props;

      return <Component {...rest} />;
    }
  };


export default initializer;

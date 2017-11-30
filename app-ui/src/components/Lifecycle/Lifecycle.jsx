// @flow
import React from 'react';

import type { ComponentType } from 'react';

type Props = {
  componentWillMount?: () => void,
  componentDidMount?: () => void,
  componentWillUnmount?: () => void,
}

/**
 * A higher order component which allows to wrap a component and dispatch lifecycle methods on mounting/unmounting.
 *
 * @param Component The component to wrap.
 */
const lifecycle = (Component: ComponentType<*>) =>
  class extends React.Component<Props> {
    /**
     * The component props.
     */
    props: Props;

    /**
     * The component default props.
     */
    static defaultProps: Object = {
      componentWillMount: () => null,
      componentDidMount: () => null,
      componentWillUnmount: () => null,
    };

    /**
     * Handler which is invoked immediately before mounting occurs.
     */
    componentWillMount() {
      if (this.props.componentWillMount !== undefined) this.props.componentWillMount();
    }

    /**
     * Handler which is invoked immediately after a component is mounted.
     */
    componentDidMount() {
      if (this.props.componentDidMount !== undefined) this.props.componentDidMount();
    }

    /**
     * Handler which is invoked immediately before a component is unmounted and destroyed.
     */
    componentWillUnmount() {
      if (this.props.componentWillUnmount !== undefined) this.props.componentWillUnmount();
    }

    /**
     * Renders the component.
     *
     * @returns The component.
     */
    render() {
      const {
        componentWillMount, componentDidMount, componentWillUnmount, ...rest
      } = this.props;

      return <Component {...rest} />;
    }
  };

export default lifecycle;

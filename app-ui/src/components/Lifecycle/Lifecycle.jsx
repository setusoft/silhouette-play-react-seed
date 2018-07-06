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
const lifecycle = (Component: ComponentType<*>) => class extends React.Component<Props> {
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
      const { componentWillMount } = this.props;

      if (componentWillMount !== undefined) componentWillMount();
    }

    /**
     * Handler which is invoked immediately after a component is mounted.
     */
    componentDidMount() {
      const { componentDidMount } = this.props;

      if (componentDidMount !== undefined) componentDidMount();
    }

    /**
     * Handler which is invoked immediately before a component is unmounted and destroyed.
     */
    componentWillUnmount() {
      const { componentWillUnmount } = this.props;

      if (componentWillUnmount !== undefined) componentWillUnmount();
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

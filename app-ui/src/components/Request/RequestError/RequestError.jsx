// @flow
import React from 'react';
import type { Node } from 'react';
import Tooltip from 'rc-tooltip';
import './RequestError.scss';
import 'rc-tooltip/assets/bootstrap.css';


type Props = {
  rId: string,
  failure?: boolean | string,
  children: Array<Node> | Node,
  errorTooltip?: boolean,
  closeError?: (data: any) => any,
}

type State = {
  visible: boolean
}

class RequestError extends React.Component<Props, State> {
  props: Props;
  state: State = { visible: true };

  _onVisibleChange = () => {
    const { rId, closeError } = this.props;
    if(typeof closeError === 'function') {
      closeError(rId);
    }

  };

  _renderFailure = () => {
    const { failure } = this.props;
    return (
      <span onClick={() => this.setState({ visible: !this.state.visible }) }>
        {failure}
      </span>
    )
  };


  render() {
    const {failure, children, errorTooltip} = this.props;
    console.log(this.props);

    if (errorTooltip && typeof failure === 'string') {
      return (
        <Tooltip
          autoAdjustOverflow
          placement="top"
          visible={this.state.visible}
          overlayClassName="errorTooltip"
          overlay={this._renderFailure}
          trigger="click"
          onVisibleChange={this._onVisibleChange}
        >
          {children}
        </Tooltip>
      )
    }
    return (
      <div className="requestErrorContainer">
        <div>An error occurred. Please try again later.</div>
      </div>
    );

  };
}

export default RequestError;

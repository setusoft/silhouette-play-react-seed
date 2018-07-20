// @flow
import React from 'react';
import type { Node } from 'react';
import Tooltip from 'rc-tooltip';
import './RequestSuccess.scss';
import 'rc-tooltip/assets/bootstrap.css';



type Props = {
  rId: string,
  success?: boolean | string,
  children: Array<Node> | Node,
  successTooltip?: boolean,
  successReplace?: boolean,
  closeSuccess: (id: any) => any,
}

type State = {
  visible: boolean
}

class RequestSuccess extends React.Component<Props, State> {
  props: Props;
  state: State = { visible: true };

  _defaultSuccessMessage = 'Request Successful';

  _onVisibleChange = () => {
    const { closeSuccess, rId } = this.props;
      this.setState({ visible: !this.state.visible });
      if(typeof closeSuccess === 'function'){
        closeSuccess(rId);
      }
  };



  render() {
    const {success, children, successTooltip, successReplace} = this.props;

    const successOverlay = typeof success === 'string' ? success : this._defaultSuccessMessage;

    if(successReplace) {
      return (
        <div className="requestSuccessContainer">
          <div>{successOverlay}</div>
        </div>
      );
    }

    if (successTooltip && success) {
      return (
        <Tooltip
          autoAdjustOverflow
          placement="top"
          visible={this.state.visible}
          overlayClassName="successTooltip"
          overlay={<span>{successOverlay}</span>}
          trigger="click"
          onVisibleChange={this._onVisibleChange}
        >
          {children}
        </Tooltip>
      )
    }

    return children;

  };
}

export default RequestSuccess;

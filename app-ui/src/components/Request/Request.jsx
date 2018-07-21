// @flow
import React from 'react';
import type { Node } from 'react';
import type { Request } from "../../modules/RequestStateModule";
import RequestError from "./RequestError/RequestError";
import RequestLoading from "./RequestLoading/RequestLoading";
import RequestSuccess from './RequestSuccess';


type Props = {
  rId: string,
  request: Request,
  onError?: (request: Request) => any,
  renderError?: Node | (request: Request) => any,
  renderLoading?: Node | (request: Request) => any,
  children: Array<Node> | Node,
  initialLoading?: boolean,
  renderInitial?: Node | (request: Request) => any,
  onCloseError?: () => any,
  onCloseSuccess?: () => any,
  append?: boolean,
  errorTooltip?: boolean,
  inject?: boolean,
  successReplace?: boolean,
  successTooltip?: boolean,
  passivePending?: boolean,

}

/**
 * Renders a Request feedback in/around a requestor component
 * 
 * @param rId             A request Id
 * @param request         A request state specified by the rId
 * @param children        The wrapped component
 * @param renderError     An optional error component that should be rendered if current request fails
 * @param renderLoading   An optional loading component that should be rendered whiles request is in flight
 * @param onError         An optional function that should be call with the request state(containing error)
 * @param initialLoading  A Switch. if true, renders a loading component until request state is successful, even if request has not started.
 * @param renderInitial   An optional component that should be rendered coupled with initialLoading. When initialLoading is true and renderInitial is not provided, loading component falls back to renderLoading falls back to default LoadingComponent provided by Request
 * @param errorTooltip    Switch show error as a tooltip on the child component
 * @param onCloseError    A function that should be called when request error component is closed/unmounted
 * @param onCloseSuccess  A function that should be called when request success component is closed/unmounted
 * @param inject          A Switch. If true, Clone-Inject component with request state and append request feedback components (tooltips, ..) instead of replacing component with feedback components
 * @param passivePending  A Switch. If true, render children as loading element instead of loading spinner
 * @param successTooltip  A Switch. Show a success description as a tooltip on the child component
 * @param successReplace  A Switch. Replaces children with success component
 * @returns {*}
 * @constructor
 */
const RequestComponent = ({
                            rId,
                            request,
                            children,
                            renderError,
                            renderLoading,
                            passivePending,
                            onError,
                            initialLoading,
                            renderInitial,
                            errorTooltip,
                            successTooltip,
                            successReplace,
                            onCloseError,
                            onCloseSuccess,
                            inject
                          }: Props) => {

  //if request isPending, replace child with loading element
  if(request.isPending && !passivePending){
    if (typeof renderLoading === 'function') {
      return renderLoading(request)
    }
    if (renderLoading && inject) { // $FlowFixMe
      return React.cloneElement(renderLoading, {...request});
    }

    return renderLoading || <RequestLoading/>;
  }
  
  //if request isPending, replace child with loading element
  if(request.isPending && passivePending) {
    const singleChild = React.Children.toArray(children).length === 1;
    if (request.isPending && inject && singleChild ) {
      //Inject element if it's a child -- $FlowFixMe
      return React.cloneElement(children, {...request});
    }

    return children;
  }

  // When request has failed
  if(!request.isPending && request.isFailure) {
    //call onError
    if(typeof onError === 'function'){
      onError(request)
    }
    if(typeof renderError === 'function') {
      return renderError(request)
    }
    if(renderError){ // $FlowFixMe
      return inject ?  React.cloneElement(renderError, {...request}) : renderError
    }

    return (
      <RequestError
        rId={rId}
        closeError={onCloseError}
        failure={request.isFailure}
        errorTooltip={errorTooltip}
      >
        {children}
      </RequestError>
    )
  }

  //Successful request
  if (!request.isPending && request.isSuccess) {
    const singleChild = React.Children.toArray(children).length === 1;
    if(inject && singleChild){
      // $FlowFixMe
      return React.cloneElement(children, {...request});
    }

    return (
      <RequestSuccess
        rId={rId}
        success={request.isSuccess}
        successReplace={successReplace}
        successTooltip={successTooltip}
        closeSuccess={onCloseSuccess}
      >
      {children}
    </RequestSuccess>
    )
  }

  // Until there request is successful, must render a loading component
  // initialLoading is usually used when an underlying component fails to render if there is no data
  if(initialLoading) {
    if(typeof renderInitial === 'function') {
      return renderInitial(request)
    }
    if(renderInitial && React.Children.toArray(renderInitial).length === 1) { // $FlowFixMe
      return React.cloneElement(renderInitial, {...request});
    }
    return renderInitial ||  <RequestLoading />
  }

  //After everything falls with no guards, return children as default
  return children;

};

export default RequestComponent;

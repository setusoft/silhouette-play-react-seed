// @flow
import React from 'react';
import { Provider } from 'react-redux';
import {
  Switch, Router, Route, Redirect,
} from 'react-router-dom';
import { history } from 'modules/LocationModule';
import I18nLoaderContainer from 'containers/I18nLoaderContainer';
import PreloaderContainer from 'containers/PreloaderContainer';
import MaintenanceContainer from 'containers/MaintenanceContainer';
import { CaptureNotFoundRoute, NotFoundRoute } from 'components/NotFound';
import { secured, unsecured } from 'util/Auth';
import * as Bundles from 'bundles';

type Props = {
  store: Object,
}

/**
 * App component.
 */
export default class App extends React.Component<Props> {
  /**
   * The component props.
   */
  props: Props;

  /**
   * Indicates if the component should be updated.
   *
   * @returns {boolean} True if the component should be updated, false otherwise.
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Renders the component.
   *
   * @returns The component.
   */
  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <I18nLoaderContainer>
          <PreloaderContainer>
            <MaintenanceContainer>
              <Router history={history}>
                <CaptureNotFoundRoute>
                  <Switch>
                    <Redirect exact from="/" to="/admin" />
                    <Route path="/admin" component={secured(Bundles.admin(store))} />
                    <Route path="/auth" component={unsecured(Bundles.auth(store))} />
                    <NotFoundRoute />
                  </Switch>
                </CaptureNotFoundRoute>
              </Router>
            </MaintenanceContainer>
          </PreloaderContainer>
        </I18nLoaderContainer>
      </Provider>
    );
  }
}

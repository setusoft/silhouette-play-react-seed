import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import lifecycle from 'components/Lifecycle';

export default (Component, actions) => {
  /**
   * Maps the state properties to the React component `props`.
   *
   * @returns {Object} The props passed to the react component.
   */
  const mapStateToProps = () => ({});

  /**
   * Maps the store `dispatch` function to the React component `props`.
   *
   * @param {Function} dispatch The Redux store dispatch function.
   * @returns {Object} The props passed to the react component.
   */
  const mapDispatchToProps = dispatch => reduce(
    actions,
    (acc, action, key) => ({ ...acc, [key]: () => dispatch(action) }),
    {},
  );

  return connect(mapStateToProps, mapDispatchToProps)(lifecycle(Component));
};

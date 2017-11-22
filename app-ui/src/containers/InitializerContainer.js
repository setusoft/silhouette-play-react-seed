import { connect } from 'react-redux';
import initializer from 'components/Initializer';

export default (Component, action) => {
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
  const mapDispatchToProps = dispatch => ({
    onInit: () => dispatch(action()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(initializer(Component));
};

import { connect } from 'react-redux';
import { history } from 'modules/LocationModule';
import { getPathname } from 'selectors/LocationSelector';
import Unauthenticated from 'components/Header/Unauthenticated';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  current: getPathname(state),
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = () => ({
  route: route => history.push(route),
});

export default connect(mapStateToProps, mapDispatchToProps)(Unauthenticated);

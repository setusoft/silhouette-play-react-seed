import { connect } from 'react-redux';
import Preloader from 'components/Preloader';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  preloaded: state.i18n.initialized && state.auth.user.initialized,
});

export default connect(mapStateToProps)(Preloader);

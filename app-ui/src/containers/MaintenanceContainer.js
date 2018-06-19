import { connect } from 'react-redux';
import Maintenance from 'components/Maintenance';
import { isHealthy } from 'selectors/HealthSelector';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  healthy: isHealthy(state),
});

export default connect(mapStateToProps)(Maintenance);

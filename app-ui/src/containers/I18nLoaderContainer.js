import { connect } from 'react-redux';
import { fetchCatalog } from 'modules/I18nModule';
import I18nLoader from 'components/I18nLoader';

/**
 * Maps the state properties to the React component `props`.
 *
 * @param {Object} state The application state.
 * @returns {Object} The props passed to the react component.
 */
const mapStateToProps = state => ({
  language: state.i18n.language,
  messages: state.i18n.catalog.messages,
});

/**
 * Maps the store `dispatch` function to the React component `props`.
 *
 * @param {Function} dispatch The Redux store dispatch function.
 * @returns {Object} The props passed to the react component.
 */
const mapDispatchToProps = dispatch => ({
  fetchCatalog: language => dispatch(fetchCatalog(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(I18nLoader);

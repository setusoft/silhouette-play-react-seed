// @flow
import React from 'react';
import { I18nProvider } from 'lingui-react';

type Props = {
  language: string,
  messages: Object,
  fetchCatalog: (language: string) => void,
  children: Element<any>,
}

/**
 * I18n loader component to dynamically loading message catalogs with Webpack.
 *
 * If the language has changed then we fetch the catalog for this language and initialize the `I18nProvider`
 * with this catalog. We initialize the `I18nProvider` only with one language at the time to reduce memory
 * consumption. The memory files are already cached by the browser, so switching a language doesn't require
 * a new request to load the catalog if it was already loaded.
 *
 * @link https://github.com/lingui/js-lingui/wiki/HowTo:-Dynamic-loading-of-languages-with-Webpack
 */
export default class I18nLoader extends React.Component {

  /**
   * The component props.
   */
  props: Props;

  /**
   * Handler which gets called after the component was applied to the DOM.
   */
  componentDidMount() {
    this.props.fetchCatalog(this.props.language);
  }

  /**
   * Indicates if the component should be updated.
   *
   * @param nextProps The next props.
   * @returns {boolean} True if the component should be updated, false otherwise.
   */
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.language !== nextProps.language) {
      this.props.fetchCatalog(nextProps.language);

      return true;
    }

    return this.props.messages !== nextProps.messages;
  }

  /**
   * Renders the component.
   *
   * @returns The react component.
   */
  render() {
    const { language, messages, children } = this.props;

    return (
      <I18nProvider language={language} messages={{ [language]: messages }}>
        {children}
      </I18nProvider>
    );
  }
}

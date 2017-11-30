// @flow
import React from 'react';
import { I18nProvider, Catalog } from 'lingui-react';

import type { Node } from 'react';

const dev = process.env.NODE_ENV !== 'production'
  // this import is required in development only
  ? require('lingui-i18n/dev')
  : null;

type Props = {
  language: string,
  catalog: Catalog,
  fetchCatalog: (language: string) => void,
  children: Node,
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
export default class I18nLoader extends React.Component<Props> {
  /**
   * The component props.
   */
  props: Props;

  /**
   * Loads the intl polyfill for browsers that don't support the Intl API.
   *
   * @param lang The current language.
   */
  static loadIntlPolyfill(lang: string): void {
    if (!global.Intl) {
      Promise.all([
        // eslint-disable-next-line function-paren-newline
        import(
          /* webpackMode: "lazy", webpackChunkName: "intl-[index]" */
          'intl'),
        // eslint-disable-next-line function-paren-newline
        import(
          /* webpackMode: "lazy", webpackChunkName: "intl-[index]" */
          `intl/locale-data/jsonp/${lang}.js`),
      ]);
    }
  }

  /**
   * Handler which gets called after the component was applied to the DOM.
   */
  componentDidMount(): void {
    this.props.fetchCatalog(this.props.language);
    I18nLoader.loadIntlPolyfill(this.props.language);
  }

  /**
   * Indicates if the component should be updated.
   *
   * @param nextProps The next props.
   * @returns True if the component should be updated, false otherwise.
   */
  shouldComponentUpdate(nextProps: Props): boolean {
    if (this.props.language !== nextProps.language) {
      this.props.fetchCatalog(nextProps.language);
      I18nLoader.loadIntlPolyfill(nextProps.language);

      return true;
    }

    return this.props.catalog !== nextProps.catalog;
  }

  /**
   * Renders the component.
   *
   * @returns The react component.
   */
  render() {
    const { language, catalog, children } = this.props;

    return (
      <I18nProvider language={language} catalogs={{ [language]: catalog }} development={dev}>
        {children}
      </I18nProvider>
    );
  }
}

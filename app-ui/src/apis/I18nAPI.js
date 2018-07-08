// @flow
/* eslint-disable class-methods-use-this */

/**
 * API to handle I18n resources.
 */
export default class I18nAPI {
  /**
   * Fetches the message catalog for the given language.
   *
   * @param language The language for which the catalog should be fetched.
   * @returns The message catalog for the given language.
   */
  async fetchCatalog(language: string): Promise<Object> {
    try {
      return await import(/* webpackChunkName: "i18n" */ `locale/${language}/messages.js`);
    } catch (e) {
      const catalog = await import(/* webpackChunkName: "i18n" */ 'locale/en/messages.js');

      return catalog;
    }
  }
}

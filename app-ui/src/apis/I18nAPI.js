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
   * @returns The message catalog for the given message.
   */
  async fetchCatalog(language: string): Promise<Object> {
    const messages = await import(
      /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
      `locale/data/${language}.json`);

    return messages;
  }
}

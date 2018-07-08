/* eslint-disable global-require */
import I18nAPI from 'apis/I18nAPI';

describe('(API) I18nAPI', () => {
  const i18nApi = new I18nAPI();

  describe('(Method) fetchCatalog', () => {
    it('Should load the catalog for the language "en"', () => {
      const maybeResult = i18nApi.fetchCatalog('en');
      return maybeResult.then((catalog) => {
        expect(catalog).to.eql(require('../../src/locale/en/messages.js'));
      });
    });

    it('Should load the catalog for the language "de"', () => {
      const maybeResult = i18nApi.fetchCatalog('de');
      return maybeResult.then((catalog) => {
        expect(catalog).to.eql(require('../../src/locale/de/messages.js'));
      });
    });

    it('Should throw an error if a catalog couldn\'t be loaded', () => {
      const maybeResult = i18nApi.fetchCatalog('e');
      return maybeResult.catch((error) => {
        expect(error).to.eql(new Error('Cannot find module \'./e.js\''));
      });
    });
  });
});

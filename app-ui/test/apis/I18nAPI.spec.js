/* eslint-disable global-require */
import I18nAPI from 'apis/I18nAPI';

describe('(API) I18nAPI', () => {
  const i18nApi = new I18nAPI();

  describe('(Method) fetchCatalog', () => {
    it('Should load the catalog for the language "en"', () => {
      const maybeResult = i18nApi.fetchCatalog('en');
      return maybeResult.then((messages) => {
        expect(messages).to.eql(require('../../src/locale/data/en.json'));
      });
    });

    it('Should load the catalog for the language "de"', () => {
      const maybeResult = i18nApi.fetchCatalog('de');
      return maybeResult.then((messages) => {
        expect(messages).to.eql(require('../../src/locale/data/de.json'));
      });
    });

    it('Should throw an error if a catalog couldn\'t be loaded', () => {
      const maybeResult = i18nApi.fetchCatalog('e');
      return maybeResult.catch((error) => {
        expect(error).to.eql(new Error('Cannot find module \'./e.json\''));
      });
    });
  });
});

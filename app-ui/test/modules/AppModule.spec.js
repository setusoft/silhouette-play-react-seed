import { isFSA } from 'flux-standard-action';
import { initApp, initAppContent } from 'modules/AppModule';

describe('(Redux Module) AppModule', () => {
  describe('(Action Creator) initApp', () => {
    it('Should be exported as a function', () => {
      expect(initApp).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initApp())).to.be.true();
    });
  });

  describe('(Action Creator) initAppContent', () => {
    it('Should be exported as a function', () => {
      expect(initAppContent).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(initAppContent())).to.be.true();
    });
  });
});

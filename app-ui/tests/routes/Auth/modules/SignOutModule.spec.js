import { isFSA } from 'flux-standard-action';
import {
  signOut,
} from 'routes/Auth/modules/SignOutModule';

describe('(Redux Module) Auth/SignOutModule', () => {
  describe('(Action Creator) signOut', () => {
    it('Should be exported as a function', () => {
      expect(signOut).to.be.a('function');
    });

    it('Should be a flux standard action', () => {
      expect(isFSA(signOut())).to.be.true();
    });
  });
});

import { isRequired } from 'util/Validator';

describe('(Util) Validator', () => {
  describe('(Validator) isRequired', () => {
    it('Should be a function', () => {
      expect(isRequired).to.be.a('function');
    });

    it('Should return false for a undefined value', () => {
      expect(isRequired(undefined)).to.be.false();
    });

    it('Should return false for a null value', () => {
      expect(isRequired(null)).to.be.false();
    });

    it('Should return false for an empty string', () => {
      expect(isRequired('')).to.be.false();
    });

    it('Should return true for a non-empty string', () => {
      expect(isRequired('test')).to.be.true();
    });
  });
});

import { isRequired } from 'util/Validator';

describe('(Util) Validator', () => {
  describe('(Validator) isRequired', () => {
    it('Should be a function', () => {
      expect(isRequired).to.be.a('function');
    });

    it('Should throw an error for a non string value', () => {
      expect(() => isRequired(undefined)).to.throw(TypeError);
    });

    it('Should return false for an empty string', () => {
      expect(isRequired('')).to.be.false();
    });

    it('Should return true for a non-empty string', () => {
      expect(isRequired('test')).to.be.true();
    });
  });
});

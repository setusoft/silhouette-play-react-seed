import {
  requestButtonProps,
  getActivateAccountEmail,
  getSignInForm,
  getSignUpForm,
  getResetToken,
  getResetPasswordForm,
  getRecoverPasswordForm
} from "bundles/Auth/selectors/AuthSelectors";


describe("(Selector) AuthSelectors", () => {

  describe('requestButtonProps', () => {
    let requestProp;
    let pending;
    let formValid;

    const getRequestProps = () => ({
      data: {
        pending: pending,
        success: false,
        failed: false
      },
      actions: {}
    });

    before(() => {
      pending = true;
      formValid = true;
      requestProp = getRequestProps();
    });

    it('Should contain only two props `loading` and `disabled`', () => {
      expect(requestButtonProps(formValid)(requestProp)).to.have.all.keys(['disabled', 'loading'])
    });

    it('Should set button to loading if form is valid and request is pending', () => {
      expect(requestButtonProps(formValid)(requestProp).loading).to.be.true();
    });
    it('Should set button to loading if form is valid given a request prop', () => {

      expect(requestButtonProps(formValid)(requestProp).loading).to.be.true();
    });

    it('Should disable button if form is not valid given a request prop', () => {
      formValid = false;
      expect(requestButtonProps(formValid)(requestProp).disabled).to.be.equal(true);
    });

    it('Should disable button if form is valid and request is pending', () => {
      formValid = true;
      pending = true;
      expect(requestButtonProps(formValid)(requestProp).disabled).to.be.equal(true);
    });

  });

  describe('getActivateAccountEmail', () => {
    let state;
    before(() => {
      state = { auth: { activateAccount: { email: 'john@doe.com' } } }
    });

    it('Should select email from state', () => {
      expect(getActivateAccountEmail(state)).to.have.all.keys(['email']);
    });
  });

  describe('getRecoverPasswordForm', () => {
    let state;
    before(() => {
      state = { auth: { recoverPassword: { form: { param: 'value' } } } }
    });

    it('Should select recover password form from state', () => {
      expect(getRecoverPasswordForm(state)).to.have.all.keys('param');
    });
  });

  describe('getResetPasswordForm', () => {
    let state;
    before(() => {
      state = { auth: { resetPassword: { form: { param: 'value' } } } }
    });

    it('Should select reset password form from state', () => {
      expect(getResetPasswordForm(state)).to.have.all.keys('param');
    });
  });

  describe('getResetToken', () => {
    let state;
    before(() => {
      state = { match: { params: { token: 'hash-tk3' } } }
    });

    it('Should select reset token from provided props', () => {
      expect(getResetToken(state)).to.be.equal('hash-tk3');
    });
  });

  describe('getSignInForm', () => {
    let state;
    before(() => {
      state = { auth: { signIn: { form: { param: 'value' } } } }
    });

    it('Should select sign up form from state', () => {
      expect(getSignInForm(state)).to.have.all.keys('param');
    });
  });

  describe('getSignUpForm', () => {
    let state;
    before(() => {
      state = { auth: { signUp: { form: { param: 'value' } } } }
    });

    it('Should select sign up form from state', () => {
      expect(getSignUpForm(state)).to.have.all.keys('param');
    });
  });

});

import config from 'config/index';

/**
 * A helper function which creates a store.
 *
 * @param state The state value.
 * @returns {{subscribe: *, dispatch: *, getState: *}} The store.
 */
export const createStore = (state) => {
  const getState = sinon.stub().returns(state);
  const subscribe = sinon.spy();
  const dispatch = sinon.spy();
  return { subscribe, dispatch, getState };
};

/**
 * A helper function which provides test scenarios for the `API` util.
 *
 * @param fetchMock   The fetchmock implementation.
 * @param apiResponse The `ApiResponse` instance.
 * @param csrfToken   An optional csrf token.
 */
export const apiTest = (fetchMock, apiResponse, csrfToken) => ({
  jsonPost: (route, json) => (response) => {
    const options = fetchMock.lastOptions();
    expect(response).to.eql(apiResponse);
    expect(fetchMock.called()).to.be.true();
    expect(fetchMock.lastUrl()).to.equal(`${config.apiBaseUrl}/${route}`);
    expect(options.method).to.equal('POST');
    expect(options.headers['Csrf-Token']).to.equal(csrfToken);
    expect(options.headers['Content-Type']).to.equal('application/json; charset=utf-8');
    expect(options.headers.Accept).to.equal('application/json');
    expect(options.credentials).to.equal('include');
    expect(options.body).to.eql(JSON.stringify(json));
  },
  formPost: route => (response) => {
    const options = fetchMock.lastOptions();
    expect(response).to.eql(apiResponse);
    expect(fetchMock.called()).to.be.true();
    expect(fetchMock.lastUrl()).to.equal(`${config.apiBaseUrl}/${route}`);
    expect(options.method).to.equal('POST');
    expect(options.headers['Csrf-Token']).to.equal(csrfToken);
    expect(options.credentials).to.equal('include');
  },
  get: route => (response) => {
    const options = fetchMock.lastOptions();
    expect(response).to.eql(apiResponse);
    expect(fetchMock.called()).to.be.true();
    expect(fetchMock.lastUrl()).to.equal(`${config.apiBaseUrl}/${route}`);
    expect(options.method).to.equal('GET');
    expect(options.credentials).to.equal('include');
  },
});

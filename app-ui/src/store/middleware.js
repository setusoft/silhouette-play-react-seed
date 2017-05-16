import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

// ======================================================
// Middleware Configuration
// ======================================================
export const sagaMiddleware = createSagaMiddleware();
export const middleware = [thunk, sagaMiddleware];

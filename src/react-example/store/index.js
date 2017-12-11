import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import initialState from './initialState'


//Simple Redux Crash Reporter
const crashReporter = () => next => action => {
  try {
    return next(action)
  } catch (err) {
    window.console.error('Caught an exception!', err);
    throw err
  }
};

let middlewares = []
//Dev and Prod
middlewares.push(thunk);

//Dev Only
if(process.env.NODE_ENV !== 'production') {
   middlewares.push(require('redux-logger').createLogger());
   middlewares.push(crashReporter);
}

const composedMiddlewares = composeWithDevTools(
  applyMiddleware(...middlewares)
);

const configureStore = () => {
  return createStore(
    rootReducer,
    initialState,
    composedMiddlewares
  );
};

const store = configureStore();

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}


export default store;

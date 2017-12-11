require("react-hot-loader/patch");

import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/scss/foundation.scss';
import '../assets/scss/layout.scss';
import App from './containers/App';
import {Provider} from 'react-redux';
import store from './store';

let render;

if(process.env.NODE_ENV !== 'production') {
  const AppContainer =  require('react-hot-loader').AppContainer;
  render = Component => {
    window.console.log(store);
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <Component />
        </Provider>
      </AppContainer>,
      document.getElementById('react-root')
    )
  };

  if (module.hot) {
    module.hot.accept('./containers/App', () => {
      try{
        window.console.log('re-rendering')
        render(App);
      } catch(err) {
        window.console.log(err);
      }
    })
  }

} else {
  
  render = Component => {
    ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
      document.getElementById('react-root')
    )
  };
  
}

render(App);



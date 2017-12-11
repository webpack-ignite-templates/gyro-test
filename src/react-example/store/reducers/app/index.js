import * as actions from '../../actions';

const app = (state = {}, action) => {
  switch(action.type) {

    case actions.app.SET_REGISTERED:
      return {...state, registered: !state.registered};


    default:
      return state;
  }
};

export default app;
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import Auth from './Auth';
import Loader from './Loader';
import app_reducer from './product';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: Auth,
    loader: Loader,
    app: app_reducer,
  });

// const rootReducer = (state, action) => {
// return appReducer(state, action);
// };

// export default rootReducer;

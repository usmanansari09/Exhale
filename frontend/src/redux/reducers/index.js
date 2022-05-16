import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import Auth from "./Auth";
import Loader from "./Loader";

export default (history) => combineReducers({
	router: connectRouter(history),
	auth: Auth,
	loader: Loader,
});

// const rootReducer = (state, action) => {
// return appReducer(state, action);
// };

// export default rootReducer;
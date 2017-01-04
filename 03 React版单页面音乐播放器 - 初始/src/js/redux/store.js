import { createStore,combineReducers,applyMiddleware,compose } from 'redux';
import * as reducers from '../redux/reducer.js';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

var store = createStore(
	combineReducers(reducers),
	composeEnhancers(applyMiddleware(thunk))
);

export default store;
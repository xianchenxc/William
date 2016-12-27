import { createStore,combineReducers,applyMiddleware } from 'redux';
import * as reducers from '../redux/reducer.js';
import thunk from 'redux-thunk';

var store = createStore(
	combineReducers(reducers),
	applyMiddleware(thunk)
);

export default store;
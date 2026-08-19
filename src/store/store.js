import { combineReducers, createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';

let reducers = combineReducers({
  reducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;

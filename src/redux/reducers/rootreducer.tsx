import {combineReducers} from 'redux';
import { todoReducer } from './todoReducer';
import { loadReducer } from './loadReducer';
export default combineReducers({
  todoReducer,loadReducer
});
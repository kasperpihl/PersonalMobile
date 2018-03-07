import { combineReducers } from 'redux';
import navigationReducer from './navigation';

const rootReducer = combineReducers({
  navigation: navigationReducer,
});

export default rootReducer;
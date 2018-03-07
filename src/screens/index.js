import { Navigation } from 'react-native-navigation';
import Account from './account';
import TodoList from './todo-list';

export const registerScreens = (store, Provider) => {
  Navigation.registerComponent('swipes.Account', () => Account, store, Provider);
  Navigation.registerComponent('swipes.TodoList', () => TodoList, store, Provider);
}
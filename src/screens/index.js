import { Navigation } from 'react-native-navigation';
import TabOne from './tab-one';
import TabTwo from './tab-two';

export const registerScreens = (store, Provider) => {
  Navigation.registerComponent('example.TabOne', () => TabOne, store, Provider);
  Navigation.registerComponent('example.TabTwo', () => TabTwo, store, Provider);
}
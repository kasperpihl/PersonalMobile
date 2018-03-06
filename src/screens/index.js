import { Navigation } from 'react-native-navigation';
import TabOne from './tab-one';
import TabTwo from './tab-two';

export const registerScreens = () => {
  Navigation.registerComponent('example.TabOne', () => TabOne);
  Navigation.registerComponent('example.TabTwo', () => TabTwo);
}
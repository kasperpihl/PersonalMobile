// import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './src/screens';
import configureStore from './src/store/configureStore';

const store = configureStore();

registerScreens(store, Provider);

const tabs = [{
  label: 'TabOne',
  screen: 'example.TabOne',
  // icon: require('../img/list.png'),
  title: 'TabOne',
}, {
  label: 'TabTwo',
  screen: 'example.TabTwo',
  // icon: require('../img/swap.png'),
  title: 'TabTwo',
}];

Navigation.startTabBasedApp({
  tabs,
  animationType: 'fade',
  tabsStyle: {
    tabBarBackgroundColor: '#003a66',
    tabBarButtonColor: '#ffffff',
    tabBarSelectedButtonColor: '#ff505c',
    tabFontFamily: 'BioRhyme-Bold',
  },
  appStyle: {
    tabBarBackgroundColor: '#003a66',
    navBarButtonColor: '#ffffff',
    tabBarButtonColor: '#ffffff',
    navBarTextColor: '#ffffff',
    tabBarSelectedButtonColor: '#ff505c',
    navigationBarColor: '#003a66',
    navBarBackgroundColor: '#003a66',
    statusBarColor: '#002b4c',
    tabFontFamily: 'BioRhyme-Bold',
  },
});

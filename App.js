import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import MainLaylout from './src/react/components/layout/MainLayout';
import MainTabBar from './src/react/components/tab-bar/MainTabBar';

export default class App extends PureComponent {
  render() {
    return (
      <MainLaylout
        bottom={<MainTabBar></MainTabBar>}
      ></MainLaylout>
    );
  }
}

import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import configureStore from './src/store/configureStore';
import MainLaylout from './src/react/components/layout/MainLayout';
import MainTabBar from './src/react/components/tab-bar/MainTabBar';

const store = configureStore({});

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <MainLaylout
          bottom={<MainTabBar></MainTabBar>}
        ></MainLaylout>
      </Provider>
    );
  }
}

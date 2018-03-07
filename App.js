// import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './src/screens';
import configureStore from './src/store/configureStore';

const store = configureStore();

registerScreens(store, Provider);

const tabs = [{
  label: 'Account',
  screen: 'swipes.Account',
  // icon: require('../img/list.png'),
  title: 'Account',
  animationType: 'slide',
}, {
  label: 'Snoosed',
  screen: 'swipes.TodoList',
  // icon: require('../img/swap.png'),
  title: 'Snoosed',
}, {
  label: 'Now',
  screen: 'swipes.TodoList',
  // icon: require('../img/swap.png'),
  title: 'Now',
}, {
  label: 'Done',
  screen: 'swipes.TodoList',
  // icon: require('../img/swap.png'),
  title: 'Done',
}];

Navigation.startTabBasedApp({
  tabs,
  drawer: { // optional, add this if you want a side menu drawer in your app
    left: { // optional, define if you want a drawer from the left
      screen: 'swipes.Account', // unique ID registered with Navigation.registerScreen
      passProps: {} // simple serializable object that will pass as props to all top screens (optional),
    },
  },
<<<<<<< HEAD
  // animationType: 'slide',
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
=======
  {
    direction: 'right',
    threshold: 20,
    // color: 'purple',
    // icon: 'Circle',
  },
  {
    id: 'complete',
    direction: 'right',
    threshold: 80,
    color: 'blue',
    // icon: 'Circle',
  }
];

export default class App extends PureComponent {
  onSwipingDidRelease(cell, e) {
    console.log('swipe ended');
  }

  render() {
    return (
      <SwipingCell
       id='cell1'
       onSwipeRelease={this.onSwipingDidRelease}
       points={points}
       height={75}
       leftColor='purple'
       leftIcon={leftIcon}
      >
       {(currentPoint) => (
         <View style={[{height: 75, backgroundColor: 'red'}]}>
           <Text>Hi</Text>
         </View>
       )}
      </SwipingCell>
      //<TimePicker initialDate={new Date()}/>
    );
  }
}
>>>>>>> parent of a10f0d3... getting default color and icon from the first point

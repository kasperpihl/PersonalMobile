import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

class MainTabBar extends PureComponent {
  constructor(props) {
    super(props);

    console.log(this.props);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.item, {marginRight: 25}]}></View>
        <View style={[styles.item]}></View>
        <View style={[styles.item]}></View>
        <View style={[styles.item]}></View>
        <View style={[styles.item, {marginLeft: 25}]}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'green',
  },
  item: {
    height: 50,
    width: 50,
    backgroundColor: 'black',
  }
});

export default MainTabBar;

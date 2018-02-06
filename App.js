import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={{
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#000000',
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 50,
          backgroundColor: 'transparent',
          overflow: 'hidden',
          
        }}>

          <View style={{
            width: '100%',
            height: 50,
            backgroundColor: 'blue',
            position: 'relative',
            right: 100
          }}>
          </View>
          <View style={{
            width: '100%',
            height: 50,
            backgroundColor: 'red',
            position: 'relative',
          }}>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

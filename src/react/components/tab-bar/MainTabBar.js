import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { navigate } from '../../../actions/navigate';

class MainTabBar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <TouchableHighlight onPress={() => {this.props.navigate('account')}}>
          <View style={[styles.item, {marginRight: 25}]}></View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => {this.props.navigate('snoozed')}}>
          <View style={[styles.item]}></View>
        </TouchableHighlight>
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

const mapStateToProps = (state) => (state);

const mapDispatchToProps = (dispatch) => ({
  navigate: (view) => dispatch(navigate(view)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainTabBar);

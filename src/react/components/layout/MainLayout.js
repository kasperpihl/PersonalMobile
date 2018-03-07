import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

class MainLayout extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.top]}>
          <Text>bla</Text>
        </View>
        <View style={[styles.bottom]}>
          {this.props.bottom}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  top: {
    backgroundColor: 'red',
    height: '100%',
  },
  bottom: {
    backgroundColor: 'blue',
    height: 60,
  }
});

const mapStateToProps = (state) => (state);

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainLayout);
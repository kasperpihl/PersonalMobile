import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Easing,
  ViewPropTypes
} from 'react-native';

const noop = () => {};

export default class App extends PureComponent {
  static defaultProps = {
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeRelease: noop,
    onSwipeComplete: noop,
    swipeReleaseAnimationFn: Animated.timing,
    swipeReleaseAnimationConfig: {
      toValue: {x: 0, y: 0},
      duration: 300,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      useNativeDriver: true,
    },
  }

  state = {
    pan: new Animated.ValueXY(),
    width: 0,
    didLayout: false,
  };

  _handleLayout = ({nativeEvent: {layout: {width}}}) => this.setState({width, didLayout: true});

  _handlePan = Animated.event([null, {
    dx: this.state.pan.x
  }]);

  _handleMoveShouldSetPanResponder = (event, gestureState) => {
    return true;
  };

  _handlePanResponderGrant = (event, gestureState) => {
    return true;
  };

  _handlePanResponderMove = (event, gestureState) => {
    this._handlePan(event, gestureState);
  }

  _handlePanResponderEnd = (event, gestureState) => {
    const {
      swipeReleaseAnimationFn,
      swipeReleaseAnimationConfig,
    } = this.props;
    const {
      pan,
    } = this.state;

    swipeReleaseAnimationFn(pan, swipeReleaseAnimationConfig).start();
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderRelease: this._handlePanResponderEnd,
    onPanResponderTerminate: this._handlePanResponderEnd,
    onPanResponderTerminationRequest: this._handlePanResponderEnd
  });

  _renderLeftSide = (transform, width) => {
    if (!this.state.didLayout) {
      return null;
    }

    return (
      <Animated.View style={[{transform, marginLeft: -width, width, backgroundColor: 'green'}, styles.sideItem]}>
        <Text>Left</Text>
      </Animated.View>
    )
  }

  _renderRightSide = (transform, width) => {
    if (!this.state.didLayout) {
      return null;
    }

    return (
      <Animated.View style={[{transform, marginRight: -width, width, backgroundColor: 'red'}, styles.sideItem]}>
        <Text>Right</Text>
      </Animated.View>
    )
  }

  render() {
    const {pan, width} = this.state;
    const transform = [{
      translateX: pan.x.interpolate({
        inputRange: [-width, width],
        outputRange: [
          -width + StyleSheet.hairlineWidth, width - StyleSheet.hairlineWidth
        ],
        extrapolate: 'clamp'
      })
    }];

    return (
      <View onLayout={this._handleLayout} style={[styles.container]} {...this._panResponder.panHandlers}>

        {this._renderLeftSide(transform, width)}

        <Animated.View style={[{transform, width}, styles.listItem]}>
          <Text>Swipe me ->>>>>></Text>
        </Animated.View>

        {this._renderRightSide(transform, width)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listItem: {
    flex: 1,
    backgroundColor: 'yellow',
    height: 75,
  },
  sideItem: {
    flex: 1,
    height: 75,
  },
});

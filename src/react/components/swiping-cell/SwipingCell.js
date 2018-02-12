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

const noop = () => {}

const orderPoints = (a,b) => {
  if (a.threshold < b.threshold)
    return -1;
  if (a.threshold > b.threshold)
    return 1;
  return 0;
}

class SwipingCell extends PureComponent {
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

  _resetState = {
    direction: 'right',
    prevThreshold: 0,
    isLeftActive: false,
    isRightActive: false,
    // inactiveOpacity: new Animated.Value(0.2),
    inactiveOpacity: 0.2,
    prevDX: 0,
    cancelLeftSwiping: false,
    cancelRightSwiping: false,
  }

  state = {
    pan: new Animated.ValueXY(),
    width: 0,
    didLayout: false,
    ...this._resetState,
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
    const {
      width,
      prevThreshold,
      prevDX,
    } = this.state;
    const {
      points,
    } = this.props;
    const enoughVelocity = Math.abs(gestureState.vx) >= 0.1;
    const swipingPercent = Math.abs(gestureState.dx / width * 100);
    const direction = gestureState.dx >= 0 ? 'right' : 'left';
    const orderedPoints = points.filter((point) => {
      return point.direction === direction;
    }).sort(orderPoints).reverse();
    const currentPoint = orderedPoints.find((point) => {
      return swipingPercent >= point.threshold;
    });
    const threshold = currentPoint ? currentPoint.threshold : 0;
    const cancelLeftSwiping = prevDX < gestureState.dx;
    const cancelRightSwiping = prevDX > gestureState.dx;


    if (prevThreshold !== threshold) {
      this.setState({
        currentPoint,
        prevThreshold: threshold,
        isLeftActive: currentPoint && direction === 'right',
        isRightActive: currentPoint && direction === 'left',
      })
    }

    if (enoughVelocity) {
      this.setState({
        cancelRightSwiping,
        cancelLeftSwiping,
        prevDX: gestureState.dx,
      })
    }

    this._handlePan(event, gestureState);
  }

  _handlePanResponderEnd = (event, gestureState) => {
    const {
      id,
      onSwipeRelease,
      swipeReleaseAnimationFn,
      swipeReleaseAnimationConfig,
    } = this.props;
    const {
      pan,
    } = this.state;

    swipeReleaseAnimationFn(pan, swipeReleaseAnimationConfig).start(() => {
      onSwipeRelease(id, event);

      this.setState({...this._resetState});
    });
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
    const {
      didLayout,
      currentPoint,
      inactiveOpacity,
      cancelLeftSwiping,
    } = this.state;
    let {
      isLeftActive
    } = this.state;
    let {
      leftColor,
    } = this.props;

    if (!didLayout) {
      return null;
    }

    const opacity = isLeftActive && cancelLeftSwiping ? 1 : inactiveOpacity;

    leftColor = isLeftActive ? currentPoint.color || leftColor : leftColor;

    const backgroundColor = leftColor ? leftColor : 'green';

    return (
      <Animated.View style={[{transform, marginLeft: -width, width, backgroundColor, opacity}, styles.sideItem]}>
        <Text>Left</Text>
      </Animated.View>
    )
  }

  _renderRightSide = (transform, width) => {
    const {
      didLayout,
      isRightActive,
      currentPoint,
      inactiveOpacity,
      cancelRightSwiping,
    } = this.state;
    let {
      rightColor,
    } = this.props;

    if (!didLayout) {
      return null;
    }

    const opacity = isRightActive && cancelRightSwiping ? 1 : inactiveOpacity;
    rightColor = isRightActive ? currentPoint.color || rightColor : rightColor;

    const backgroundColor = rightColor || 'red';

    return (
      <Animated.View style={[{transform, marginRight: -width, width, backgroundColor, opacity}, styles.sideItem]}>
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

export default SwipingCell
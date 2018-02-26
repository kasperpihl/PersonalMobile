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

const orderPoints = (points, direction) => {
  return points.filter((point) => {
    return point.direction === direction;
  }).sort(comparePoints).reverse();
}
const comparePoints = (a,b) => {
  if (a.threshold < b.threshold)
    return -1;
  if (a.threshold > b.threshold)
    return 1;
  return 0;
}

class SwipingCell extends PureComponent {
  constructor(props) {
    super(props);

    const { points } = props;

    this._orderedPoints = {
      left: orderPoints(points, 'left'),
      right: orderPoints(points, 'right'),
    }

    this._defaultLeftColor = this._orderedPoints.right.reverse()[0].color || 'white';
    this._defaultLeftIcon = this._orderedPoints.right.reverse()[0].icon || null;
    this._defaultRightColor = this._orderedPoints.left.reverse()[0].color || 'white';
    this._defaultRightIcon = this._orderedPoints.left.reverse()[0].icon || null;;
  }

  static defaultProps = {
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeRelease: noop,
    onSwipeComplete: noop,
    swipeReleaseAnimationFn: Animated.timing,
    swipeReleaseSpringAnimationFn: Animated.spring,
    swipeCancelReleaseAnimationConfig: {
      toValue: {x: 0, y: 0},
      duration: 300,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      useNativeDriver: true,
    },
    swipeActivateReleaseAnimationConfig: {
      bounciness: 0,
      speed: 30,
      useNativeDriver: true,
    },
    rejectVelocity: 0.05,
    height: 20,
  }

  _resetState = {
    direction: 'right',
    prevThreshold: 0,
    isLeftActive: false,
    isRightActive: false,
    inactiveOpacity: 0.2,
    prevDX: 0,
    cancelLeftSwiping: false,
    cancelRightSwiping: false,
    active: false,
  }

  state = {
    pan: new Animated.ValueXY(),
    width: 0,
    didLayout: false,
    enableTouchEvents: true,
    ...this._resetState,
  };

  _runAnimation = (animObject, animFn, animConfig, callback, block) => {
    this.setState({
      enableTouchEvents: false,
    });

    animFn(animObject, animConfig).start(() => {
      callback();

      if (!block) {
        this.setState({
          enableTouchEvents: true,
        });
      }
    })
  }

  _reject = () => {
    const {
      swipeReleaseAnimationFn,
      swipeCancelReleaseAnimationConfig,
    } = this.props;
    const {
      pan,
    } = this.state;

    return this._runAnimation(pan, swipeReleaseAnimationFn, swipeCancelReleaseAnimationConfig, () => {
  this.setState({...this._resetState});
}, true)
  }

  _handleLayout = ({nativeEvent: {layout: {width}}}) => this.setState({ width, didLayout: true });

  _handlePan = Animated.event([null, {
    dx: this.state.pan.x
  }]);

  _handleMoveShouldSetPanResponder = (event, gestureState) => {
    const {
      enableTouchEvents,
    } = this.state;

    return enableTouchEvents;
  };

  _handlePanResponderGrant = (event, gestureState) => {
    return true;
  };

  _handlePanResponderMove = (event, gestureState) => {
    const {
      width,
      prevThreshold,
      prevDX,
      pan,
      isLeftActive,
      isRightActive,
      enableTouchEvents,
      active,
    } = this.state;
    const {
      rejectVelocity,
    } = this.props;

    if (!enableTouchEvents) {
      return;
    }

    const enoughVelocity = Math.abs(gestureState.vx) >= rejectVelocity;
    const swipingPercent = Math.abs(gestureState.dx / width * 100);
    const direction = gestureState.dx >= 0 ? 'right' : 'left';

    const currentPoint = this._orderedPoints[direction].find((point) => {
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

    if (enableTouchEvents && active) {
      return this._reject();
    }

    if (enableTouchEvents && !active) {
      return this._handlePan(event, gestureState); 
    }
  }

  _handlePanResponderEnd = (event, gestureState) => {
    const {
      id,
      onSwipeRelease,
      swipeReleaseAnimationFn,
      swipeReleaseSpringAnimationFn,
      swipeCancelReleaseAnimationConfig,
      swipeActivateReleaseAnimationConfig,
    } = this.props;
    const {
      pan,
      isLeftActive,
      isRightActive,
      width,
      cancelLeftSwiping,
      cancelRightSwiping,
      currentPoint,
    } = this.state;
    const velocity = gestureState.vx
    const customEventObject = {
      currentPoint,
      reject: this._reject,
      origEvent: event,
    }

    if (isLeftActive && !cancelRightSwiping) {
      return this._runAnimation(pan, swipeReleaseSpringAnimationFn, {toValue: {x: width, y: 0}, velocity, ...swipeActivateReleaseAnimationConfig}, () => {
  onSwipeRelease(id, customEventObject);
  this.setState({
    active: true,
  });
})
    }

    if (isRightActive && !cancelLeftSwiping) {
      return this._runAnimation(pan, swipeReleaseSpringAnimationFn, {toValue: {x: -width, y: 0}, velocity, ...swipeActivateReleaseAnimationConfig}, () => {
  onSwipeRelease(id, customEventObject);
  this.setState({
    active: true,
  });
})
    }

    return this._runAnimation(pan, swipeReleaseAnimationFn, swipeCancelReleaseAnimationConfig, () => {
  onSwipeRelease(id, customEventObject);
  this.setState({...this._resetState});
})
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

  _renderLeftSide = (transform) => {
    const {
      didLayout,
      currentPoint,
      inactiveOpacity,
      cancelLeftSwiping,
      width,
    } = this.state;
    const {
      height,
    } = this.props;
    let {
      isLeftActive
    } = this.state;

    if (!didLayout) {
      return null;
    }

    const leftColor = this._defaultLeftColor;
    const leftIcon = this._defaultLeftIcon;
    const opacity = isLeftActive && cancelLeftSwiping ? 1 : inactiveOpacity;
    const backgroundColor = isLeftActive ? currentPoint.color || leftColor : leftColor;
    const icon = isLeftActive ? currentPoint.icon || leftIcon : leftIcon;

    return (
      <Animated.View style={[{transform, marginLeft: -width, width, height, backgroundColor, opacity}, styles.sideItem]}>
        {icon}
      </Animated.View>
    )
  }

  _renderRightSide = (transform) => {
    const {
      didLayout,
      isRightActive,
      currentPoint,
      inactiveOpacity,
      cancelRightSwiping,
      width,
    } = this.state;
    const {
      height,
    } = this.props;

    if (!didLayout) {
      return null;
    }

    const rightColor = this._defaultRightColor;
    const rightIcon = this._defaultRightIcon;
    const opacity = isRightActive && cancelRightSwiping ? 1 : inactiveOpacity;
    const backgroundColor = isRightActive ? currentPoint.color || rightColor : rightColor;
    const icon = isRightActive ? currentPoint.icon || rightIcon : rightIcon;

    return (
      <Animated.View style={[{transform, marginRight: -width, width, height, backgroundColor, opacity}, styles.sideItem]}>
        {icon}
      </Animated.View>
    )
  }

  render() {
    const {pan, width, currentPoint} = this.state;
    const {height} = this.props;
    const transform = [{
      translateX: pan.x.interpolate({
        inputRange: [-width, width],
        outputRange: [
          -width , width
        ],
        extrapolate: 'clamp'
      })
    }];

    return (
      <View onLayout={this._handleLayout} style={[styles.container]} {...this._panResponder.panHandlers}>

        {this._renderLeftSide(transform)}

        <Animated.View style={[{transform, width, height}, styles.listItem]}>
          {this.props.children(currentPoint)}
        </Animated.View>

        {this._renderRightSide(transform)}
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
  },
  sideItem: {
    flex: 1,
  },
});

export default SwipingCell

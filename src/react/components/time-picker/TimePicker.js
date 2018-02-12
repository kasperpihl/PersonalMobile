
import React, { Component } from 'react';
import {
  Text,
  PanResponder,
  View
} from 'react-native';

import moment from 'moment'

import distanceBetweenPoints from './distanceBetweenPoints';
import angleBetweenPoints from './angleBetweenPoints';
import pointFromAngleDistance from './pointFromAngleDistance';

const kWheelRadius = 150;
const kConfirmRadius = 80;
const kDotSize = 60;

const kEnableConfirmRadius = 60;
const kClearRadius = 45;

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {};
    this.onLayout = this.onLayout.bind(this);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this._dAngle = 0;
        this.setState({ isSwiping: true });
        this.updateState(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { centerX, centerY } = this.state;
        const x = evt.nativeEvent.pageX;
        const y = evt.nativeEvent.pageY;

        const { isOutOfScope } = this.updateState(x, y);

        if(!isOutOfScope) {
          if(typeof this._lastX !== 'undefined') {
            const angle = angleBetweenPoints(centerX, centerY, this._lastX, this._lastY, x, y);
            this._dAngle = this._dAngle + angle;
            const angleInterval = 50 * Math.PI / 180;
          }
          this._lastX = x;
          this._lastY = y;
        } else {
          this._lastX = undefined;
          this._lastY = undefined;
          this._dAngle = 0;
        }
        
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ isSwiping: false });
      },
    });
  }
  updateState(x, y) {
    const {
      isInConfirmButton,
      isOutOfScope,
      dotAngle,
      centerX,
      centerY,
    } = this.state;

    let returnObj = { isInConfirmButton, isOutOfScope, dotAngle };

    const distance = distanceBetweenPoints(centerX, centerY, x, y);

    const newDotAngle = Math.atan2(centerY - y, centerX - x) + Math.PI;
    const newConfirm = (distance < kEnableConfirmRadius);
    const newScope = (distance < kClearRadius);

    if(dotAngle !== newDotAngle || newScope !== isOutOfScope || newConfirm !== isInConfirmButton) {
      returnObj = { 
        dotAngle: newDotAngle,
        isInConfirmButton: newConfirm,
        isOutOfScope: newScope,
      };
      this.setState(returnObj);
    }

    return returnObj;
  }
  onLayout(e1, e2) {
    if(!this.didMeasure) {
      this.wheelComp.measure((...args) => this.setState({
        centerX: args[4] + args[2]/2,
        centerY: args[5] + args[3]/2,
      }));
      this.didMeasure = true;
    }
  }
  render() {
    const {
      dotAngle,
      isInConfirmButton,
      isOutOfScope,
      isSwiping,
    } = this.state;
    
    const dotCenterDistance = kConfirmRadius + (kWheelRadius - kConfirmRadius)/ 2;
    
    const { x, y } = pointFromAngleDistance(kWheelRadius, kWheelRadius, dotAngle, dotCenterDistance);

    const dotStyles = {
      top: y - 30,
      left: x - 30,
      opacity: isSwiping && !isOutOfScope ? 1 : 0,
    };

    const confirmStyles = {
      backgroundColor: isInConfirmButton ? 'green' : 'white'
    };

    return (
      <View
        style={styles.container}
        {...this._panResponder.panHandlers}
        onLayout={this.onLayout}
        
      >
        <View style={styles.circle} ref={(view) => { this.wheelComp = view; }}>
          <View style={[confirmStyles, styles.confirmCircle]}></View>
          <View style={[dotStyles, styles.dot]}></View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  dot: {
    position: 'absolute',
    width: kDotSize,
    height: kDotSize,
    borderRadius: kDotSize / 2,
    backgroundColor: 'green',
    
  },
  confirmCircle: {
    width: kConfirmRadius * 2,
    height: kConfirmRadius * 2,
    borderRadius: kConfirmRadius,
  },

  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: kWheelRadius * 2,
    width: kWheelRadius * 2,
    marginBottom: 50,
    borderRadius: kWheelRadius,
    backgroundColor: 'red'
  }
};

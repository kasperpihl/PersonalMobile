import React, { Component } from 'react';
import { element } from 'react-swiss';

import '../../../swiss/init';

import {
  Text,
  PanResponder,
  View
} from 'react-native';

import moment from 'moment'

import distanceBetweenPoints from './distanceBetweenPoints';
import angleBetweenPoints from './angleBetweenPoints';
import pointFromAngleDistance from './pointFromAngleDistance';

import sw from './time-picker.swiss';

const kWheelRadius = 150;
const kConfirmRadius = 80;
const kDotSize = 60;

const kEnableConfirmRadius = 60;
const kClearRadius = 45;

const Container = element(View, sw.container);
const Circle = element(View, sw.circle);
const ConfirmCircle = element(View, sw.confirmCircle);
const Dot = element(View, sw.dot);

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
    
    let { x, y } = pointFromAngleDistance(kWheelRadius, kWheelRadius, dotAngle, dotCenterDistance);

    x = x - kDotSize / 2;
    y = y - kDotSize / 2;

    const active = !!(isSwiping && !isOutOfScope);

    return (
      <Container
        {...this._panResponder.panHandlers}
        onLayout={this.onLayout}>
        <Circle innerRef={(view) => { this.wheelComp = view; }}>
          <ConfirmCircle isInConfirmCircle={isInConfirmButton} />
          <Dot top={y} left={x} active={active} />
        </Circle>
          
      </Container>
    );
  }
}

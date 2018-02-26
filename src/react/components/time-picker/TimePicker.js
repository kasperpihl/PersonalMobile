import React, { Component } from 'react';
import { element } from 'react-swiss';

import {
  Text,
  PanResponder,
  View
} from 'react-native';

import moment from 'moment'
import 'moment-round';

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
const TimeContainer = element(View, sw.timeContainer);
const TimeLabel = element(Text, sw.timeLabel);
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
            let angleInterval = 50;
            let minutesPerInterval = 5;
            const absVel = Math.abs(gestureState.vx) + Math.abs(gestureState.vy);
            if(absVel > 0.8) {
              angleInterval = 40;
              minutesPerInterval = 30;
            }
            angleInterval = angleInterval * Math.PI / 180;
            const numberOfIntervals = -1 * Math.round(this._dAngle/angleInterval);
            console.log(absVel);
            if(numberOfIntervals != 0) {
              this._dAngle = 0;
              const minTime = moment(this.state.minDate);
              const maxTime = moment(this.state.maxDate);
              let absIntervals = Math.abs(numberOfIntervals);
              let newDate = moment(this.state.currentDate)
                              .add(numberOfIntervals * minutesPerInterval, 'minutes');
              if(newDate.isBefore(minTime)) {
                newDate = minTime;
              } else if(newDate.isAfter(maxTime)) {
                newDate = maxTime;
              }
              console.log(newDate.format());
              this.setState({ currentDate: newDate.format() });
            }
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
  componentWillMount() {
    const { initialDate } = this.props;
    this.setState({
      minDate: moment(initialDate).startOf('day').format(),
      maxDate: moment(initialDate).endOf('day').floor(5, 'minutes').format(),
      currentDate: moment(initialDate).round(5, 'minutes').format(),
    })
    console.log(moment(initialDate).endOf('day').floor(5, 'minutes').format(), moment(initialDate).round(5, 'minutes').format());
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
      currentDate,
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
        <TimeContainer>
          <TimeLabel>{moment(currentDate).format('H:mm')}</TimeLabel>
        </TimeContainer>
        <Circle innerRef={(view) => { this.wheelComp = view; }}>
          <ConfirmCircle isInConfirmCircle={isInConfirmButton} />
          <Dot top={y} left={x} active={active} />
        </Circle>
          
      </Container>
    );
  }
}

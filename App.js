import React, { PureComponent } from 'react';
import SwipingCell from './src/react/components/swiping-cell/SwipingCell';
import SvgUri from 'react-native-svg-uri';

const leftIcon = <SvgUri
width="50"
height="50"
source={{uri:'./assets/svgs/tick.svg'}}
/>
const points = [
  {
    direction: 'left',
    threshold: 20,
    color: 'purple',
    icon: leftIcon,
  },
  {
    direction: 'right',
    threshold: 20,
    // color: 'purple',
    // icon: 'Circle',
  },
  {
    id: 'complete',
    direction: 'right',
    threshold: 80,
    color: 'blue',
    // icon: 'Circle',
  }
];

export default class App extends PureComponent {
  onSwipingDidRelease(cell, e) {
    console.log('swipe ended');
  }

  render() {
    return (
      <SwipingCell
        id='cell1'
        onSwipeRelease={this.onSwipingDidRelease}
        points={points}
        leftColor='purple'
        leftIcon={leftIcon}
      ></SwipingCell>
    );
  }
}

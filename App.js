import React, { PureComponent } from 'react';
import SwipingCell from './src/react/components/swiping-cell/SwipingCell';

const points = [
  {
    direction: 'left',
    threshold: 20,
    color: 'purple',
    // icon: 'Circle',
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
    console.log('bla');
  }

  render() {
    return (
      <SwipingCell
        id='cell1'
        onSwipeRelease={this.onSwipingDidRelease}
        points={points}
        leftColor='purple'
      ></SwipingCell>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Container extends PureComponent {
  onSwipingDidRelease(cell, e) {
    if(cell.direction === 'right' && cell.threshold === 40) {

    }
  }
  onSwipingWillRelease(cell, state, e) {
    /*
      id: 'cell1',
      refreshContent: () => {}
    */
    cell.refreshContent();
  }
  renderContent(cell) {
    return (
      
    )
  }
  render() {
    return (
      <SwipingCell
        id="cell1"
        onDidRelease={this.onSwipingDidRelease}
        states={[
          {
            direction: 'right',
            threshold: 40,
            color: 'red',
            icon: 'Circle',
          },
          {
            id: 'complete'
            direction: 'left',
            threshold: 40,
            color: 'red',
            icon: 'Circle',
          }
        ]}>
        {this.renderContent}
      </SwipingCell>
    );
  }
}

export default Container

const { string, arrayOf, shape } = PropTypes;

Container.propTypes = {
  cellId: oneOf(string, number),
  onDidRelease: func,
  onWillRelease: func,
  states: arrayOf(shape({
    id: oneOf(string, number),
    direction: oneOf(['left', 'right']).isRequired,
    threshold: number,
    backgroundColor
  })).isRequired
};
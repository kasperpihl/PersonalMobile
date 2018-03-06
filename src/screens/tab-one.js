import React from 'react';
import {View, Text} from 'react-native';
import { connect } from 'react-redux';

class TabOne extends React.Component {
	constructor(props) {
		super(props);

    console.log(props);
	}

  render() {
    return (
      <View>
        <Text>Tab One</Text>
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TabOne);
// export default TabOne;
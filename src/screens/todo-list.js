import React from 'react';
import {View, Text} from 'react-native';
import { connect } from 'react-redux';

class TodoList extends React.Component {
	constructor(props) {
		super(props);

    console.log(props);
	}

  render() {
    return (
      <View>
        <Text>Todo List</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
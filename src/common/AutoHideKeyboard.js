import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
  } from 'react-native';
import PropTypes from 'prop-types';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
export default class AutoHideKeyboard extends Component {
    static propTypes = {
        content: PropTypes.element,
    }
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <TouchableWithoutFeedback style={{flex:1}} onPress={dismissKeyboard}>
                {this.props.content}
            </TouchableWithoutFeedback>
        )
    }
}
/**
 * Button.js
 *
 * ## Function
 * It defines a basic button component,with some default settings.
 * To customize it, simply override the style code.
 *
 * ## Touch event
 *  @param onPress: defines the event when user pressing the button
 *
 * ## PropTypes
 *  @param btnText: 'this is a footer'
 *  @param onForward: configure its forwarding (for navigator) scene
 *  @param style: customized style
 *
 * @zchen
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

import text from '../style/text';

const propTypes = {
  btnText: PropTypes.string,
  onForward: PropTypes.func,
};

export default class Button extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let btnStyle;
    if (this.props.enableButtonStyle) {
      btnStyle = styles.button;
    }

    return (
      <TouchableOpacity
        style={[btnStyle, this.props.style]}
        onPress={this.props.onForward}>
        <Text style={[text.button, this.props.textStyle]}>
          { this.props.btnText }
        </Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = propTypes;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 2,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    marginBottom: 10,
  }
});

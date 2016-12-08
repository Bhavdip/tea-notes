/**
 * IconButton.js
 *
 * ## Function
 * It defines an icon button component,with some default settings.
 * To customize it, simply override the style code.
 *
 * ## Touch event
 *  @param onPress: defines the event when user pressing the button
 *
 * ## PropTypes
 *  @param onForward: configure its forwarding (for navigator) scene
 *  @param style: customized style
 *
 * @zchen
 */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import text from '../style/text';

const propTypes = {
  iconName: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  labelText: PropTypes.string,
};

export default class IconButtonWithLabel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={[styles.button, this.props.style]}>
        <Icon name={this.props.iconName} size={this.props.size} color={this.props.color} />
        <Text style={text.labelText}>{this.props.labelText}</Text>
      </View>
    );
  }
}

IconButtonWithLabel.propTypes = propTypes;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 2,
    flexDirection: 'column',
    height: 48,
    justifyContent: 'center',
  },
});

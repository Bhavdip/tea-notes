/**
 * ImageRow.js
 *
 * ## Function
 * This is used in TeaSelection scene, showing a list of teas' pictures as background,
 * with tea's name on mid-center of the image.
 *
 * ## Touch event
 * when touching the object, it will open TeaDetail scene, showing the details of
 * this selected tea.
 *
 * ## PropTypes
 *  @param tea: {name, temperature,time}
 *  @param imageSource: `require(path-to-image)`
 *  @param onPressEvent
 *
 * @zchen
 */

import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import containers from '../style/containers';
import color from '../style/color';
import text from '../style/text';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export default class ImageRow extends Component {
  render() {
    let addedByMe;
    if (this.props.tea.addedByMe) {
      addedByMe = <Text>#added by me</Text>;
    }
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.props.onPressEvent}>
          <View style={{paddingBottom: 1}}>
            <Image style={styles.image} source={this.props.imageSource}>
              <View style={[containers.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={[text.title, text.shadow, {color: color.white, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0)'}]}>{this.props.tea.name}</Text>
                {addedByMe}
              </View>
            </Image>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = {
  image: {
    height: 150,
    width: SCREEN_WIDTH,
  }
};

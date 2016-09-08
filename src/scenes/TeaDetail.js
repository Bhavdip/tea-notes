import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ListView,
  Text,
  Image,
  StatusBar,
  View
} from 'react-native';

import Button from '../components/Button.js'

import { SCREEN_WIDTH, SCREEN_HEIGHT, COVERIMAGE_HEIGHT, CARD_OFFSET } from '../constants';

export default class TeaDetail extends Component {
  constructor(props) {
    super(props);
    this._onBack = this._onBack.bind(this);
  }
  _onBack() {
    this.props.navigator.pop();
  }
  render() {
    return(
      <View style={styles.container}>
        <ScrollView>
          <View style={[styles.container, {backgroundColor: 'white', height: SCREEN_HEIGHT}]}>
            <View>
              <Image source={{uri: this.props.currentSelectedTea.coverImageUrl.uri}} style={styles.coverImage} />
              <View style={[styles.backBtn, {backgroundColor: 'rgba(0,0,0,0)'}]}>
                <TouchableOpacity onPress={this._onBack}>
                  <Text style={[styles.text, {color: 'white', fontSize: 14}]}>close</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.teaCard}>
                <View style={styles.teaCardContainer}>
                  <View>
                    <Text style={styles.teaCard_title}>{this.props.currentSelectedTea.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.teaCard_tags}>green tea - mild - low caffeine</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', marginTop: 10 + CARD_OFFSET}}>
              <Text style={[styles.text, {fontSize: 14}]}>tap to see in different units of measurements</Text>
            </View>
            <View>
              <View style={[styles.row, {marginTop: 10, marginBottom: 10, backgroundColor: 'white'}]}>
                <Text style={[styles.text, {fontSize: 25, color: 'black'}]}>🎚{this.props.currentSelectedTea.temperature} °</Text>
                <Text style={[styles.text, {fontSize: 25, color: 'black'}]}>⏳{this.props.currentSelectedTea.time} min</Text>
              </View>
            </View>
            <View style={[styles.container, {borderWidth: 2}]}>
              <Text>How to brew</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.stickyFooter}>
          <Button btnText="Start Brewing!" style={{backgroundColor: 'rgb(148,235,95)'}} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'rgb(102,102,102)',
    fontFamily: 'Open Sans',
    fontSize: 20,
  },
  backBtn: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  coverImage: {
    height: COVERIMAGE_HEIGHT,
    resizeMode: 'cover',
    width: SCREEN_WIDTH,
  },
  teaCard: {
    position: 'absolute',
    bottom: -CARD_OFFSET,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  teaCardContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: COVERIMAGE_HEIGHT * 0.4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOpacity: 0.5,
    borderRadius: 2,
  },
  teaCard_title: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: 'bold',
  },
  teaCard_tags: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    color: 'rgb(102,102,102)',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
  }
});

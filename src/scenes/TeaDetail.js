import React, { Component, PropTypes } from 'react';
import {
  ActionSheetIOS,
  Image,
  ListView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

import Button from '../components/Button';
import BackBtn from '../components/BackBtn';
import TopBtn from '../components/TopBtn';
import IconButton from '../components/IconButton';

import text from '../style/text';
import color from '../style/color';
import colorScheme from '../style/colorScheme';
import containers from '../style/containers';
import position from '../style/position';

import celsiusToFahrenheit from '../utils/celsiusToFahrenheit';
import secondToMinute from '../utils/secondToMinute';
import findSelectedSettingOption from '../utils/findSelectedSettingOption';
import convertSecondToMinuteString from '../utils/convertSecondToMinuteString';

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  COVERIMAGE_HEIGHT,
  CUSTOMIZED_SETTINGS_STORAGE_KEY,
  CUSTOMIZED_TEA_LIST_STORAGE_KEY,
  DEFAULT_SETTINGS,
  SYMBOL_CELSIUS,
  SYMBOL_FAHRENHEIT,
  SYMBOL_SECOND,
  SYMBOL_MINUTE
} from '../constants';



export default class TeaDetail extends Component {
  constructor(props) {
    super(props);
    this._onForward = this._onForward.bind(this);
    this._showShareActionSheet = this._showShareActionSheet.bind(this);
    this._toggleLike = this._toggleLike.bind(this);
    this._displayTimeInDifferentUnit = this._displayTimeInDifferentUnit.bind(this);

    this.settings = DEFAULT_SETTINGS;
    if (this.props.storage) {
      if (this.props.storage[CUSTOMIZED_SETTINGS_STORAGE_KEY].content) {
        this.settings = this.props.storage[CUSTOMIZED_SETTINGS_STORAGE_KEY].content;
      }
    }

    this.state = {
      displayTime: `${this.props.currentSelectedTea.time} ${SYMBOL_SECOND}`,
      displayTimeInSecond: true,
      displayTimeInMinute: false,
    };
  }

  _onForward() {
    this.props.navigator.push({
      name: 'TeaTimer'
    });
  }

  _showShareActionSheet() {
    // TODO: url needs to be a real one, which can be opened in browser!
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: 'http://react-review.leanapp.cn',
      message: 'Share an awesome tea note to you!',
      subject: 'a subject to go in the email heading',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter'
      ]
    },
    (error) => {
      console.log(error);
    } ,
    (success, method) => {
      var text;
      if (success) {
        text = `Shared via ${method}`;
      } else {
        text = 'You didn\'t share';
      }
    });
  }

  _toggleLike() {
    let tea = Object.assign({}, this.props.currentSelectedTea);
    tea.isLiked = !tea.isLiked;
    this.props.storageUnit.updateItem(CUSTOMIZED_TEA_LIST_STORAGE_KEY, tea);
    this.props.updateCurrentSelectedTea(tea);
  }

  _displayTimeInDifferentUnit() {
    if (!this.state.displayTimeInSecond && this.state.displayTimeInMinute) {
      this.refs.displayTime.fadeOut();
      this.setState({
        displayTime: `${this.props.currentSelectedTea.time} ${SYMBOL_SECOND}`,
        displayTimeInSecond: true,
        displayTimeInMinute: false,
      });
       this.refs.displayTime.fadeIn();
    } else if (this.state.displayTimeInSecond && !this.state.displayTimeInMinute) {
      this.refs.displayTime.fadeOut();
      this.setState({
        displayTime: convertSecondToMinuteString(secondToMinute(this.props.currentSelectedTea.time), SYMBOL_MINUTE, SYMBOL_SECOND),
        displayTimeInSecond: false,
        displayTimeInMinute: true,
      });
      this.refs.displayTime.fadeIn();
    }
  }

  render() {
    const temperatureOption = findSelectedSettingOption(this.settings.temperatureOptions);
    const timeOption = findSelectedSettingOption(this.settings.timeOptions);

    let temperature;
    if (temperatureOption === "celsius") {
      temperature = `${this.props.currentSelectedTea.temperature} ${SYMBOL_CELSIUS}`;
    } else {
      temperature = `${celsiusToFahrenheit(this.props.currentSelectedTea.temperature)} ${SYMBOL_FAHRENHEIT}`;
    }

    //like icons
    let likeIconName = 'heart-o';
    let likeIconColor = color.white;
    if (this.props.currentSelectedTea.isLiked) {
      likeIconName = 'heart';
      likeIconColor = colorScheme.color5;
    }

    let ratingStars = [];
    let rating = this.props.currentSelectedTea.rating;
    for (let i = 1; i <= 5; i++) {
      if (i > rating) {
        ratingStars.push('star-o');
      } else {
        ratingStars.push('star');
      }
    }

    let userNotes = this.props.currentSelectedTea.userNotes;
    if (userNotes === '') {
      userNotes = 'You don\'t have any notes now. Add your notes here!';
    }

    return(
      <View style={[containers.container, {backgroundColor: color.lightGray}]}>
        <ScrollView>
          <View style={[containers.container, {paddingBottom: 80, justifyContent: 'flex-start'}]}>
            <BackBtn
              navigator={this.props.navigator}
              onPressEvent={() => {
                this.props.updateEditingStatus(false);
              }} />
            <View>
              <Image source={{uri: this.props.currentSelectedTea.coverImageUrl.uri}} style={styles.coverImage} />
              <View>
                <View style={[styles.teaCardContainer, {justifyContent: 'center'}]}>
                  <View style={[containers.row, {alignItems: 'flex-end'}]}>
                    <Text style={text.title}>{this.props.currentSelectedTea.name}</Text>
                  </View>

                  <View style={containers.row, {alignItems: 'center', paddingTop: 5, paddingBottom: 10}}>
                    <Text style={[text.p, {color: color.gray}]}>green tea - mild - low caffeine</Text>
                  </View>

                  <View style={[containers.row, {alignItems: 'flex-start', justifyContent: 'center'}]}>
                    {ratingStars.map((starIconName, index) => {
                      return (<FontAwesomeIcon name={starIconName} key={index} size={20} color={color.yellow} />);
                    })}
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View style={[containers.row, containers.card]}>
                <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                  <IoniconsIcon name="ios-thermometer" size={20} color={color.pink} />
                  <Text style={[text.number, {marginLeft: 10}]}>{temperature}</Text>
                </View>
                <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                  <IoniconsIcon name="ios-time" size={20} color={color.pink} />
                  <TouchableWithoutFeedback onPress={this._displayTimeInDifferentUnit}>
                    <View>
                      <Animatable.Text ref="displayTime" style={[text.number, {marginLeft: 10}]}>
                        {this.state.displayTime}
                      </Animatable.Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            <View>
              <View style={[containers.container, {justifyContent: 'flex-start', marginTop: 5, backgroundColor: color.white}]}>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15, borderBottomWidth: 1, borderBottomColor: color.lightGray}}>
                  <Text style={text.sectionTitle}>How to brew</Text>
                </View>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15}}>
                  <Text style={text.p}>
                    {this.props.currentSelectedTea.brewSteps}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={[containers.container, {justifyContent: 'flex-start', marginTop: 5, backgroundColor: color.white}]}>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15, borderBottomWidth: 1, borderBottomColor: color.lightGray}}>
                  <Text style={text.sectionTitle}>Notes</Text>
                </View>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15}}>
                  <Text style={text.p}>
                    {userNotes}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[containers.stickyFooter, {left: 0, right: 0}]}>
          <View style={{height: 40, backgroundColor: colorScheme.color1}}>
            <View style={[containers.row, {justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10}]}>
              <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                <IconButton
                  iconName={likeIconName}
                  size={20}
                  color={likeIconColor}
                  onForward={this._toggleLike} />
              </View>
              <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                <IconButton
                  iconName="share-square-o"
                  size={20}
                  color={color.white}
                  onForward={this._showShareActionSheet} />
              </View>
              <View style={[containers.row, {justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme.color5}]}>
                <IconButton
                  iconName="coffee"
                  size={20}
                  color={color.white}
                  onForward={this._onForward} />
              </View>
              <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                <IconButton
                  iconName="pencil-square-o"
                  size={20}
                  color={color.white}
                  onForward={() => {
                    this.props.updateEditingStatus(true);
                    this.props.navigator.push({
                      name: 'CreateTea'
                    });
                  }} />
              </View>
              <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
                <IconButton
                  iconName="trash-o"
                  size={20}
                  color={color.white}
                  onForward={() => {
                    ActionSheetIOS.showActionSheetWithOptions({
                      options: ['delete this tea note', 'cancel'],
                      destructiveButtonIndex: 0,
                      cancelButtonIndex: 1,
                    }, (buttonIndex) => {
                      if (buttonIndex === 0) {
                        this.props.storageUnit.deleteItem(CUSTOMIZED_TEA_LIST_STORAGE_KEY, this.props.currentSelectedTea);
                        this.props.navigator.pop();
                      }
                    });
                  }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  coverImage: {
    height: COVERIMAGE_HEIGHT,
    resizeMode: 'cover',
    width: SCREEN_WIDTH,
  },
  teaCard: {
    alignItems: 'center',
  },
  teaCardContainer: {
    width: SCREEN_WIDTH,
    height: COVERIMAGE_HEIGHT * 0.5,
    backgroundColor: color.white,
    borderRadius: 2,
  }
});

/**
 * CreateTea.js
 *
 * @zchen
 */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Button from '../components/Button.js';
import BackBtn from '../components/BackBtn.js';
import WithLabel from '../components/WithLabel.js';
import ItemPicker from '../components/ItemPicker.js';
import IconButton from '../components/IconButton';

import { SCREEN_WIDTH, SCREEN_HEIGHT, COVERIMAGE_HEIGHT, CARD_OFFSET, CUSTOMIZED_TEA_LIST_STORAGE_KEY, STATUS_BAR_HEIGHT_IOS } from '../constants';

import text from '../style/text.js';
import color from '../style/color.js';
import containers from '../style/containers.js';

class Tea {
  constructor({name, temperature, time, coverImageUrl}) {
    this.name = name;
    this.temperature = temperature;
    this.time = time;
    this.coverImageUrl = coverImageUrl;
    this.isLiked = false;
  }
  isEqual(anotherTea) {
    if ((this.name === anotherTea.name) && (this.temperature === anotherTea.temperature) && (this.time === anotherTea.time)) {
      return true;
    }
    return false;
  }
}

const defaultTea = new Tea({
  name: 'Name of Tea',
  temperature: '95',
  time: '180',
  coverImageUrl: null,
});

export default class CreateTea extends Component {
  constructor(props) {
    super(props);

    this._coverPhotoOnClick = this._coverPhotoOnClick.bind(this);
    this._showTemperaturePicker = this._showTemperaturePicker.bind(this);
    this._showTimePicker = this._showTimePicker.bind(this);
    this._dismissPicker = this._dismissPicker.bind(this);
    this._updateTemperature = this._updateTemperature.bind(this);
    this._updateTime = this._updateTime.bind(this);
    this._saveTea = this._saveTea.bind(this);
    this._updateTea = this._updateTea.bind(this);

    this.state = {
      isCoverImageSelected: false,
      showTemperaturePicker: false,
      showTimePicker: false,

      tea: {
        id: 0,
        name: '',
        temperature: '',
        time: '',
        coverImageUrl: null,
        brewSteps: '',
        userNotes: '',
      },

      customizedTeaList: this.props.storage[CUSTOMIZED_TEA_LIST_STORAGE_KEY],

      screenOffset: 0,
    };

    this.temperature = Array.apply(null, {length: 56}).map((element, index) => {
      return String(index + 65);
    });

    this.time = Array.apply(null, {length: 10}).map((element, index) => {
      return String(index + 1);
    });

    this.placeholders = {
      name: 'Name of Tea',
      temperature: 'temp',
      time: 'time'
    };

  };

  componentDidMount() {
    if (this.props.isEditing) {
      this.setState({
        tea: this.props.currentSelectedTea
      });
    }
  }

  _coverPhotoOnClick() {
    const options = {
      title: 'Select Tea photo',
      storageOptions: {
        skipBackup: false,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // or a reference to the platform specific asset location
        let source;
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }

        const tea = Object.assign({}, this.state.tea);
        tea.coverImageUrl = source;

        this.setState({ tea, isCoverImageSelected: true });
      }
    });
  }

  _showTemperaturePicker() {
    this.setState({
      showTemperaturePicker: true,
      showTimePicker: false,
    });
  }

  _showTimePicker() {
    this.setState({
      showTemperaturePicker: false,
      showTimePicker: true,
    });
  }

  _dismissPicker() {
    this.setState({
      showTemperaturePicker: false,
      showTimePicker: false,
    });
  }

  _updateTemperature(temperature) {
    const tea = Object.assign({}, this.state.tea);
    tea.temperature = temperature;
    this.setState({ tea });
  }

  _updateTime(time) {
    const tea = Object.assign({}, this.state.tea);
    tea.time = time;
    this.setState({ tea });
  }

  _saveTea() {
    // TODO: info validation

    let tea = Object.assign({}, this.state.tea);
    tea.brewSteps = this.props.brewSteps;
    tea.userNotes = this.props.userNotes;

    if (defaultTea.isEqual(tea) === false) {
      // customizedTeaList: {storageKey: "", content: []}
      let existingList = Object.assign({}, this.state.customizedTeaList);

      let customizedTeaList;
      if ((existingList.content !== undefined) && (existingList.content.length > 0)) {
        customizedTeaList = Object.assign([], existingList.content);
        tea.id = customizedTeaList[customizedTeaList.length-1].id + 1;
        customizedTeaList.push(tea);
      } else {
        tea.id = 0;
        customizedTeaList = [tea];
      }

      this.props.storageUnit.saveItem(CUSTOMIZED_TEA_LIST_STORAGE_KEY, JSON.stringify(customizedTeaList));
    }
  }

  _updateTea() {
    const tea = Object.assign({}, this.state.tea);
    this.props.storageUnit.updateItem(CUSTOMIZED_TEA_LIST_STORAGE_KEY, tea);
    this.props.updateCurrentSelectedTea(tea);
  }

  render() {
    let teaCoverPhoto;
    if ((this.state.isCoverImageSelected) || (this.props.isEditing)) {
      teaCoverPhoto = <Image source={this.state.tea.coverImageUrl} style={styles.coverImage}/>;
    } else {
      teaCoverPhoto = <Image source={require('../../public/image/photo_placeholder.png')} style={styles.coverImage} />;
    }

    let footer;
    if (this.state.showTemperaturePicker) {
      footer = <View style={styles.picker}>
                <ItemPicker
                  selectedValue={this.state.tea.temperature}
                  onValueChangeEvent={this._updateTemperature}
                  values={this.temperature}
                  dismissPicker={this._dismissPicker}
                  textStyle={text.p} />
              </View>;
    } else if (this.state.showTimePicker) {
      footer = <View style={styles.picker}>
                <ItemPicker
                  selectedValue={this.state.tea.time}
                  onValueChangeEvent={this._updateTime}
                  values={this.time}
                  dismissPicker={this._dismissPicker}
                  textStyle={text.p} />
              </View>;
    }

    let saveBtnOnPressEvent;
    let navbarTitle;
    let brewSteps;
    let userNotes;

    if (this.props.isEditing) {
      saveBtnOnPressEvent = this._updateTea;
      navbarTitle = 'Edit note';
      brewSteps = this.state.tea.brewSteps;
      userNotes = this.state.tea.userNotes;
    } else {
      saveBtnOnPressEvent = this._saveTea;
      navbarTitle = 'Create note';
      brewSteps = this.props.brewSteps;
      userNotes = this.props.userNotes;
    }

    return(
      <View style={containers.container}>
        <View style={{height: STATUS_BAR_HEIGHT_IOS, backgroundColor: color.pink}}></View>
        <View style={{height: 40, backgroundColor: color.pink}}>
          <View style={[containers.row, {justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10}]}>
            <View style={[containers.row, {justifyContent: 'flex-start'}]}>
              <IconButton
                iconName="times"
                size={20}
                color={color.white}
                onForward={() => {
                  this.props.navigator.pop();
                }} />
            </View>
            <View style={[containers.row, {justifyContent: 'center', alignItems: 'center'}]}>
              <Text style={[text.title, {color: color.white}]}>{navbarTitle}</Text>
            </View>
            <View style={[containers.row, {justifyContent: 'flex-end'}]}>
              <Button enableButtonStyle={false} btnText="save" onForward={saveBtnOnPressEvent} />
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={[containers.container, {backgroundColor: color.lightGray, paddingBottom: 60}]}>
            <View>
              <TouchableWithoutFeedback onPress={this._coverPhotoOnClick}>
                {teaCoverPhoto}
              </TouchableWithoutFeedback>

              <View style={styles.teaCard}>
                <View style={styles.teaCardContainer}>
                  <View>
                    <TextInput
                      value={this.state.tea.name}
                      placeholder={this.placeholders.name}
                      autoFocus={true}
                      style={[text.title, styles.teaCard_title, styles.inputBox]}
                      onChangeText={(name) => {
                        const tea = Object.assign({}, this.state.tea);
                        tea.name = name;
                        this.setState({ tea });
                      }}
                    />
                  </View>

                  <View>
                    <Text style={[text.p, {color: color.gray}]}>green tea - mild - low caffeine</Text>
                  </View>

                </View>
              </View>
            </View>

            <View>
              <View style={[containers.row, {marginTop: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: color.white}]}>
                <View>
                  <WithLabel iconName="ios-thermometer" textStyle={text.p} showPicker={this._showTemperaturePicker}>
                    <Text style={[text.number, styles.teaCard_data]}>
                      {this.state.tea.temperature}
                    </Text>
                  </WithLabel>
                </View>
                <View>
                  <WithLabel iconName="ios-time" textStyle={text.p} showPicker={this._showTimePicker}>
                    <Text style={[text.number, styles.teaCard_data]}>
                      {this.state.tea.time}
                    </Text>
                  </WithLabel>
                </View>
              </View>
            </View>

            <View>
              <View style={[containers.container, {justifyContent: 'flex-start', marginTop: 15, backgroundColor: color.white}]}>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15, borderBottomWidth: 1, borderBottomColor: color.lightGray}}>
                  <Text style={text.sectionTitle}>How to brew</Text>
                </View>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15}}>
                  <View>
                    <Text style={text.p}>{brewSteps}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                      this.props.navigator.push({ name: 'AddNote' });
                      this.props.updateEditingNoteType('brewSteps');
                    }}>
                    <Text style={[text.p, {color: color.aqua}]}>+ add a new step</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <View style={[containers.container, {justifyContent: 'flex-start', marginTop: 15, backgroundColor: color.white}]}>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15, borderBottomWidth: 1, borderBottomColor: color.lightGray}}>
                  <Text style={text.sectionTitle}>Notes</Text>
                </View>
                <View style={{paddingTop: 10, marginLeft: 15, paddingBottom: 10, marginRight: 15}}>
                  <Text style={[text.p]}>{userNotes}</Text>
                  <TouchableOpacity onPress={() => {
                      this.props.navigator.push({ name: 'AddNote' });
                      this.props.updateEditingNoteType('userNotes');
                    }}>
                    <Text style={[text.p, {color: color.aqua}]}>+ add your note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {footer}
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  teaCard_title: {
    width: SCREEN_WIDTH * 0.8,
    textAlign: 'center',

    // text input height
    height: 40,
  },
  teaCard_data: {
    textAlign: 'left',
    width: 50,
    textAlignVertical: 'center',
  },
  inputBox: {
    borderWidth: 0,
    textAlignVertical: 'center',
  },
  picker: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

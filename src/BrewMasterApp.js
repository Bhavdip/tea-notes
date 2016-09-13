/**
 * brewMaster.js
 *
 * main app file
 *
 * @zchen
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Text,
  View
} from 'react-native';

import Main from './scenes/Main.js';
import Setting from './scenes/Setting.js';
import CreateTea from './scenes/CreateTea.js';
import TeaSelection from './scenes/TeaSelection.js';
import TeaDetail from './scenes/TeaDetail.js';
import TeaTimer from './scenes/TeaTimer.js';

import getFromStorage from './utils/getFromStorage';
import saveToStorage from './utils/saveToStorage';

import {
  DEFAULT_TEA_LIST,
  CUSTOMIZED_TEA_LIST_STORAGE_KEY,
  SCENE_TRANSITION_FLOAT_RIGHT,
  SCENE_TRANSITION_FLOAT_LEFT
} from './constants';

const BaseConfig = Navigator.SceneConfigs.FloatFromBottom;

const propTypes = {};

const defaultPropTypes = {
  setting: {
    temperature: 'celsius',
    time: 'minute',
    water: 'ml',
  },
  teaLists: DEFAULT_TEA_LIST,
  currentSelectedTea: {},
};

export default class brewMaster extends Component {
  constructor(props) {
    super(props);
    this._renderScene = this._renderScene.bind(this);
    this._updateCurrentSelectedTea = this._updateCurrentSelectedTea.bind(this);

    this.state = {
      setting: {
        temperature: 'celsius',
        time: 'minute',
        water: 'ml',
      },
      currentSelectedTea: {},
    };
  }

  componentDidMount() {
    const customizedTeaList = getFromStorage(CUSTOMIZED_TEA_LIST_STORAGE_KEY);
  }

  _updateCurrentSelectedTea(teaObject) {
    this.setState({
      currentSelectedTea: teaObject,
    });
  }

  _renderScene(route, navigator) {
    switch (route.name) {
      case 'Main':
        return (<Main navigator={navigator} />);
      case 'TeaSelection':
        return (<TeaSelection
          navigator={navigator}
          updateCurrentSelectedTea={this._updateCurrentSelectedTea} />);
      case 'Setting':
        return (<Setting
          navigator={navigator}
          setting={this.state.setting} />);
      case 'TeaDetail':
        return (<TeaDetail
          navigator={navigator}
          currentSelectedTea={this.state.currentSelectedTea}
          setting={this.state.setting} />);
      case 'CreateTea':
        return (<CreateTea
          navigator={navigator}
          setting={this.state.setting} />);
      case 'TeaTimer':
        return (<TeaTimer
          navigator={navigator}
          setting={this.state.setting}
          currentSelectedTea={this.state.currentSelectedTea} />);

      default: return;
    }
  }
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'Main', index: 0 }}
        configureScene={(route) => {
          if (SCENE_TRANSITION_FLOAT_RIGHT.includes(route.name)) {
            return Navigator.SceneConfigs.FloatFromRight;
          } else if (SCENE_TRANSITION_FLOAT_LEFT.includes(route.name)) {
            return Navigator.SceneConfigs.FloatFromLeft;
          } else {
            return Navigator.SceneConfigs.FloatFromBottom;;
          }
        }}
        renderScene={this._renderScene}
      />
    );
  }
}

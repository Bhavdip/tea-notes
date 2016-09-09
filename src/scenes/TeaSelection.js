/**
 * TeaSelection.js
 *
 * @zchen
 */

import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Text,
  Image,
  StatusBar,
  AsyncStorage,
  View
} from 'react-native';

import ImageRow from '../components/ImageRow.js'
import Button from '../components/Button.js'
import BackBtn from '../components/BackBtn.js';

import { DEFAULT_TEA_LIST, CUSTOMIZED_TEA_LIST_STORAGE_KEY } from '../constants';

export default class TeaSelection extends Component {
  constructor(props) {
    super(props);
    this._onForward = this._onForward.bind(this);

    this.defaultTeaList = DEFAULT_TEA_LIST;
    this.state = {
      customizedTeaList: [],
    };
  }

  _onForward(teaObject) {
    // update parent state 'currentSelectedTea'
    this.props.updateCurrentSelectedTea(teaObject);
    this.props.navigator.push({
      name: 'TeaDetail',
    });
  }
  componentWillMount() {
    this.getData().done();
  }

  async getData() {
    try {
      let value = await AsyncStorage.getItem(CUSTOMIZED_TEA_LIST_STORAGE_KEY);
      if (value !== null){
        const customizedTeaList = JSON.parse(value);
        this.setState({ customizedTeaList: customizedTeaList.customizedTeaList });
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  _generateTeaList() {
    // 1. merge customizedTeaList and defaultTeaList
    // 2. sort based on alphabet on tea.name
    // *sanity check: make sure this.state.customizedTeaList is not empty
    let mergedTeaList;

    if (this.state.customizedTeaList !== undefined) {
      mergedTeaList = [...this.defaultTeaList, ...this.state.customizedTeaList];
    } else {
      mergedTeaList = Object.assign([], this.defaultTeaList);
    }

    const tempList = mergedTeaList.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0;
    }).slice();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const teaLists = ds.cloneWithRows(tempList);
    return teaLists;
  }

  render() {
    const teaLists = this._generateTeaList();

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <BackBtn navigator={this.props.navigator} textStyle={[styles.text, {color: 'white', fontSize: 14}]} text="back" />
        <ScrollView>
          <View style={styles.nameList}>
            <ListView
              dataSource={teaLists}
              renderRow={(teaObject) =>
                <ImageRow
                  imageSource={{uri: teaObject.coverImageUrl.uri}}
                  tea={teaObject}
                  onPressEvent={() => this._onForward(teaObject)}
                />} />
            <ImageRow
              imageSource={require('../../public/image/puer-tea.png')}
              tea={{name:"pu-er tea"}}
            />
            <ImageRow
              imageSource={require('../../public/image/tieguanyin.jpg')}
              tea={{name:"tie guan yin"}}
            />
            <ImageRow
              imageSource={require('../../public/image/jinjunmei.jpg')}
              tea={{name:"jin jun mei black tea"}}
            />
            <ImageRow
              imageSource={require('../../public/image/matcha-green-tea.png')}
              tea={{name:"matcha green tea"}}
            />
            <ImageRow
              imageSource={require('../../public/image/puer-tea.png')}
              tea={{name:"pu-er tea"}}
            />
            <ImageRow
              imageSource={require('../../public/image/tieguanyin.jpg')}
              tea={{name:"tie guan yin"}}
            />
            <ImageRow
              imageSource={require('../../public/image/jinjunmei.jpg')}
              tea={{name:"jin jun mei black tea"}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  text: {
    color: '#333333',
  },
  nameList: {
    backgroundColor: 'transparent',
  },
});

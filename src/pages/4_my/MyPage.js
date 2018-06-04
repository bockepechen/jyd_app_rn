import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';

export default class MyPage extends Component {
  render() {
    return (
      <View>
        <NavigationBar title='我的'
          navColor='#FF6A6A'
          statusBarColor='#AAAAAA'
          statusBarStyle='light-content'/>
        <Text style={{fontSize:20}}>MyPage!</Text>
      </View>
    )
  }
}
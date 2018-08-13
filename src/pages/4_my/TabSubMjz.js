import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'

let isAndroid = Platform.OS==='android'?true:false;
export default class TabSubMjz extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      next_page:"",
      itemUrl:'',
    }
  }

  componentDidMount() {
    
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
        <Text>bbb</Text>
      </View>
    )
  }

  render() {
    return (
      this.renderMainView()
    )
  }
}
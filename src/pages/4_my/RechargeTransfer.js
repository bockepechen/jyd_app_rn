import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

let isAndroid = Platform.OS==='android'?true:false;
export default class RechargeTransfer extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
    }
  }

  componentDidMount() {
    
  }

  renderMainView() {
    return(
      <View>
          <Text>aaa</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderMainView()}    
      </View>
    )
  }
}
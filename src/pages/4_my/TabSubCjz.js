import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ProductCardSpread from './ProductCardSpread';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabSubCjz extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      isSelect: -1,
    }
  }

  componentDidMount() {
    
  }

  keyExtractor = (data, index) => {return String(index);}

  _onPressItem = (index,item,type) => {
    
  }

  renderItem = (data) => {
    return (
      <ProductCardSpread
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        {...this.props}
      />
    )
  }

  renderMainView() {
    // 数据
    let data = [];
    for (let i = 0; i < 20; i++) {
        data.push({
            key: i,
            title: 'title=' + i
        })
    }
    return(
      <FlatList
          style={{flex:1}}
          ref={(flatList) => (this.flatList = flatList)}
          keyExtractor={this.keyExtractor}
          data={data}
          renderItem={this.renderItem}
      />
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
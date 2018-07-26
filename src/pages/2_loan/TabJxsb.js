import React, { Component } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import ViewUtils from '../../utils/ViewUtils';
import ProductCardJxsb from './ProductCardJxsb';

export default class TabJxsb extends Component {
  constructor(props){
    super(props);
    this.state = {
      sourceData: [
        {
          titleImg:ImageStores.cp_xina,
          titleName:'资金周转',
          rate:6.24,
          period:6,
          restMoney:194544.24,
          isRestMoney: true,
          ifSell:true
        },
        {
          titleImg:ImageStores.cp_chea,
          titleName:'【担保】装修',
          rate:10.24,
          period:12,
          restMoney:12887627.99,
          isRestMoney: true,
          ifSell:true
        },
        {
          titleImg:ImageStores.cp_xinaa,
          titleName:'旅游',
          rate:6.24,
          period:18,
          restMoney:0,
          isRestMoney: false,
          ifSell:false
        },
        {
          titleImg:ImageStores.cp_cheaa,
          titleName:'购物',
          rate:6.24,
          period:24,
          restMoney:0,
          isRestMoney: false,
          ifSell:false
        },
      ],
      selected: new Map(),
      isRefresh: false
    }
  }

  keyExtractor = (data, index) => {return String(index);}
  
  renderFlatListItem = (data) => {
    return (
      <ProductCardJxsb
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(data.index)}
        {...this.props}/>
    )
  }

  _onPressItem = (id) => {
    console.log(`selected id is ${id}`);
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    });
    // let navData = {
    //   title:'嘉季丰'
    // };
    // this.props.navigation.navigate('LoanPageDetails',{
    //   data:navData,
    //   ...this.props
    // })
  };

  render() {
    return (
      <FlatList
        style={{paddingTop:scaleSize(63)}}
        data={this.state.sourceData}
        extraData={this.state.selected}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderFlatListItem}
        initialNumToRender={6}
        refreshControl={
          <RefreshControl 
            title={'加载中...'}
            colors={['red']}
            tintColor={'red'}
            titleColor={'red'}
            refreshing={this.state.isRefresh}
            onRefresh={this.loadData} />
        }
        ListFooterComponent={ViewUtils.renderTransparentTabNavFoot()}/>
    )
  }
}
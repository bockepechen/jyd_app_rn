import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight,
  Platform,
  TouchableOpacity
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

const isIOS = Platform.OS==='ios'?true:false;
export default class RedPacketItem extends Component {
  constructor(props) {
    super(props);
    this.paraData = this.props.data.item;
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id,this.paraData,'item');
  };
  
  _onPressBtn = () => {
    this.props.onPressItem(this.props.id,this.paraData,'btn');
  };

  render() {
    return (
      <TouchableHighlight 
        underlayColor='rgba(0,0,0,0)'
        onPress={this._onPress}
        style={{alignItems:'center'}}>
        <ImageBackground 
          source={this.paraData.status == '1' ? ImageStores.me_23 : ImageStores.me_22} 
          resizeMode={'stretch'} 
          style={{width:scaleSize(1062), height:scaleSize(411),
          flexDirection:'row',justifyContent:'space-between'}}
        >
          <View style={{flexDirection:'column'}}>
            <Text 
              style={{marginTop:scaleSize(50),marginLeft:scaleSize(60),fontSize:scaleSize(42),color:this.paraData.status == '1' ? '#c7b299' : '#c3c3c3',fontWeight:'bold'}}>
              {'现金红包'}
            </Text>
            <View style={{marginTop:scaleSize(50),flexDirection:'row',height:scaleSize(104)}}>
              <Text 
                style={{marginTop:scaleSize(62),marginLeft:scaleSize(99),fontSize:scaleSize(42),color:this.paraData.status == '1' ? '#ff3a49' : '#989898',fontWeight:'bold'}}>
                {`¥ `}
              </Text>
              <Text 
                style={{fontSize:scaleSize(104),color:this.paraData.status == '1' ? '#ff3a49' : '#989898',fontWeight:'bold'}}>
                {`${this.paraData.amount}`}
              </Text>
            </View>
            <Text 
              style={{marginTop:scaleSize(21),marginLeft:scaleSize(99),fontSize:scaleSize(28),color:this.paraData.status == '1' ? '#998675' : '#c3c3c3'}}>
              {`奖励来源:${this.paraData.award_from}`}
            </Text>
            <Text 
              style={{marginTop:scaleSize(23),marginLeft:scaleSize(99),fontSize:scaleSize(28),color:this.paraData.status == '1' ? '#fff' : '#c3c3c3'}}>
              {`${this.paraData.status == '1' ? '有效日期' : '使用日期'}:${this.paraData.status == '1' ? (this.paraData.expiry_start_time+' 至 '+(this.paraData.expiry_end_time == '' ? '无限期':this.paraData.expiry_end_time) ) : this.paraData.use_time }`}
            </Text>
          </View>
          <View style={{marginRight:scaleSize(90),justifyContent:'center'}}>
            <TouchableOpacity
              onPress={()=>{}}
            >
              <Text 
                style={{fontSize:scaleSize(60),color:this.paraData.status == '1' ? '#c7b299' : '#e6e6e6',fontWeight:'bold', width:scaleSize(60)}}>
                {this.paraData.status == '1' ? '打开红包' : '已打开'}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    )
  }
}
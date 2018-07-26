import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight,
  Platform
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardSbzr extends Component {
  constructor(props) {
    super(props);
    this.paraData = this.props.data.item;
  }

  render() {
    return (
      <TouchableHighlight 
        underlayColor='rgba(0,0,0,0)'
        onPress={this._onPress}
        style={{marginBottom:scaleSize(9)}}>
        <ImageBackground source={ImageStores.cp_3} resizeMode={'stretch'} style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(510), flexDirection:'row'}}>
          <View style={{marginLeft:isIOS?scaleSize(108):scaleSize(114), marginTop:scaleSize(72), width:scaleSize(480), height:scaleSize(345)}}>
            <View style={{height:scaleSize(51), flexDirection:'row'}}>
              <Image source={this.paraData.titleImg} resizeMode={'stretch'} style={{width:scaleSize(126), height:scaleSize(51)}} />
              <Text style={{marginLeft:scaleSize(27), fontSize:scaleSize(42), fontWeight:'bold', color:'#656565'}}>{this.paraData.titleName}</Text>
            </View>
            <View style={{marginTop:scaleSize(51), flexDirection:'row', alignItems:'flex-end'}}>
              <View style={{marginLeft:scaleSize(12), height:scaleSize(78)}}>
                <Text style={{fontSize:scaleSize(78), fontWeight:'200', color:'#998675'}}>{this.paraData.rate}</Text>
              </View>
              <View style={{height:scaleSize(48)}}>
                <Text style={{fontSize:scaleSize(48), fontWeight:'200', color:'#998675'}}>{'%'}</Text>
              </View>
              <View style={{marginLeft:scaleSize(21), height:scaleSize(36)}}>
                <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:'#998675'}}>{'年化利率'}</Text>
              </View>
            </View>
            <Text style={{marginLeft:scaleSize(12), marginTop:scaleSize(66), fontSize:scaleSize(36), color:'#998675'}}>{`剩余金额(元): ${this.paraData.restMoney}`}</Text>
            <Text style={{marginLeft:scaleSize(12), marginTop:scaleSize(18), fontSize:scaleSize(36), color:'#998675'}}>{`剩余金额(元): ${this.paraData.transferMoney}`}</Text>
          </View>
          <View style={{marginLeft:isIOS?scaleSize(141):scaleSize(135), marginTop:scaleSize(126), width:scaleSize(336), height:scaleSize(312), alignItems:'center'}}>
            <Text style={{fontSize:scaleSize(48), color:'#998675'}}>{'剩余期限'}</Text>
            <Text style={{marginTop:scaleSize(24), fontSize:scaleSize(48), fontWeight:'bold', color:'#998675'}}>{`${this.paraData.period}期+${this.paraData.addDay}天`}</Text>
            <ImageBackground 
              source={this.paraData.ifSell?ImageStores.sy_15:ImageStores.cp_2} 
              resizeMode={'stretch'} 
              style={{marginTop:isIOS?scaleSize(54):scaleSize(48), width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:this.paraData.ifSell?'#FFFFFF':'#656565'}}>{this.paraData.ifSell?'立即出借':'已转让'}</Text>
            </ImageBackground>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    )
  }
}
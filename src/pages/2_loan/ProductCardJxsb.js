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
import Utils from '../../utils/Utils';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardJxsb extends Component {
  constructor(props) {
    super(props);
    this.paraData = this.props.data.item;
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id,this.paraData,'item');
  };
  
  _onPressBtn = () => {
    if(this.paraData.buyStatus == '0'){
      this.props.onPressItem(this.props.id,this.paraData,'btn');
    }
  };

  render() {
    return (
      <TouchableHighlight 
        underlayColor='rgba(0,0,0,0)'
        onPress={this._onPress}
        style={{marginBottom:scaleSize(9)}}>
        <ImageBackground source={ImageStores.cp_4} resizeMode={'stretch'} style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(372), flexDirection:'row'}}>
          <View style={{marginLeft:scaleSize(108), marginTop:isIOS?scaleSize(69):scaleSize(75), width:scaleSize(450), height:scaleSize(213)}}>
            <View style={{height:scaleSize(51), flexDirection:'row'}}>
              <Image source={this.paraData.BorrowTypeId == '1' ? ImageStores.me_28 : ImageStores.me_29} resizeMode={'stretch'} style={{width:scaleSize(48), height:scaleSize(48)}} />
              <Text style={{marginLeft:scaleSize(27), fontSize:scaleSize(42), fontWeight:'bold', color:'#656565'}}>{this.paraData.Description}</Text>
            </View>
            <View style={{marginTop:isIOS?scaleSize(78):scaleSize(72), flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <View style={{width:scaleSize(282), flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
                <View style={{height:scaleSize(78)}}>
                  <Text style={{fontSize:scaleSize(78), fontWeight:'200', color:'#998675'}}>{Utils.formatMoney(this.paraData.YearRate,2)}</Text>
                </View>
                <View style={{height:scaleSize(48)}}>
                  <Text style={{fontSize:scaleSize(48), fontWeight:'200', color:'#998675'}}>{'%'}</Text>
                </View>
              </View>
              <View style={{marginLeft:isIOS?scaleSize(21):scaleSize(27), marginRight:isIOS?0:scaleSize(12), height:scaleSize(36)}}>
                <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:'#998675'}}>{'年化利率'}</Text>
              </View>
            </View>
          </View>
          <View style={{marginLeft:scaleSize(135), marginTop:scaleSize(72), width:scaleSize(372), height:scaleSize(261), alignItems:'center'}}>
            <Text style={{fontSize:scaleSize(48), color:'#998675'}}>{`借款期限 ${this.paraData.BorrowMonth}期`}</Text>
            {
              this.paraData.isRestMoney?
                (<Text style={{marginTop:scaleSize(18), fontSize:scaleSize(36), color:'#989898'}}>{`剩余 ${Utils.formatMoney(this.paraData.restmoneyamount,2)}元`}</Text>):
                null
            }
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={this._onPressBtn}>
              <ImageBackground 
                source={this.paraData.buyStatus == '0' ?ImageStores.sy_17:ImageStores.cp_1} 
                resizeMode={'stretch'} 
                style={{marginTop:this.paraData.isRestMoney?scaleSize(15):scaleSize(36), width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:this.paraData.buyStatus == '0' ?'#FFFFFF':'#656565'}}>{this.paraData.disPlay}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    )
  }
}
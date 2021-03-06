import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableHighlight,
  Platform
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import Utils from '../../utils/Utils';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardSub extends Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  _onPress = () => {
    this.props.onPress(this.props.id,this.props.data,'item');
  };

  _onPressBtn = () => {
    if(this.props.data.buyStatus == '0'){
      this.props.onPress(this.props.id,this.props.data,'btn');
    }
  };

  render() {
    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0)'
        onPress={this._onPress}
        style={{marginTop:this.props.top, marginBottom:this.props.bottom}}>
        <ImageBackground 
          source={ImageStores.sy_20} 
          resizeMode={'stretch'} 
          style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(402), flexDirection:'row'}}>
          <View style={{marginTop:isIOS?scaleSize(78):scaleSize(72), marginLeft:scaleSize(114), width:scaleSize(480), height:scaleSize(234), flexDirection:'column'}}>
            <Text style={{fontSize:scaleSize(42), fontWeight:'bold', color:'#656565'}}>{this.props.data.sellname}</Text>
            <View style={{marginTop:isIOS?scaleSize(54):scaleSize(48), height:scaleSize(66), flexDirection:'row', alignItems:'flex-end'}}>
              <View style={{height:scaleSize(54)}}>
                <Text style={{fontSize:scaleSize(54), fontWeight:'200', color:'#998675'}}>{Utils.formatMoney(this.props.data.expectedyearyield,2)}</Text>
              </View>
              <View style={{height:scaleSize(32)}}>
                <Text style={{fontSize:scaleSize(32), fontWeight:'200', color:'#998675'}}>{'%'}</Text>
              </View>
              <View style={{height:scaleSize(54)}}>
                <Text style={{fontSize:scaleSize(54), fontWeight:'200', color:'#998675'}}>{'+'}</Text>
              </View>
              <View style={{height:scaleSize(66)}}>
                <Text style={{fontSize:scaleSize(66), fontWeight:'200', color:'#ff3a49'}}>{Utils.formatMoney(this.props.data.improveyearrate,2)}</Text>
              </View>
              <View style={{height:scaleSize(32)}}>
                <Text style={{fontSize:scaleSize(32), fontWeight:'200', color:'#ff3a49'}}>{'%'}</Text>
              </View>
            </View>
            <Text style={{marginTop:scaleSize(36), fontSize:scaleSize(34), color:'#989898'}}>{'年化利率'}</Text>
            <ImageBackground 
              source={ImageStores.sy_16}
              resizeMode={'stretch'}
              style={{position:'absolute', width:scaleSize(150), height:scaleSize(54), right:0, top:scaleSize(42), alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:scaleSize(26), color:'#ff3a49'}}>{'出借奖励'}</Text>
            </ImageBackground>
          </View>
          <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.PIXEL, marginTop:scaleSize(69), marginBottom:scaleSize(69), marginLeft:scaleSize(27)}}/>
          <View style={{marginTop:scaleSize(78), marginLeft:0, width:scaleSize(522), height:scaleSize(261), flexDirection:'column', alignItems:'center'}}>
            <Text style={{fontSize:scaleSize(48), color:'#998675'}}>锁定期限 {' '+this.props.data.expiresdays}天</Text>
            {
              this.props.data.restmoney?
                (<Text style={{marginTop:scaleSize(18), fontSize:scaleSize(36), color:'#989898'}}>剩余{' '+Utils.formatMoney(this.props.data.restmoney,2)}元</Text>)
                :null
            }
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={this._onPressBtn}>
              <ImageBackground 
                source={this.props.data.buyStatus == '0'?ImageStores.sy_15:ImageStores.cp_2} 
                resizeMode={'stretch'} 
                style={{marginTop:this.props.data.restmoney?scaleSize(21):scaleSize(36), width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:this.props.data.buyStatus == '0' ?'#FFFFFF':'#656565'}}>{this.props.data.display}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    )
  }
}
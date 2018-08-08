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

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardMain extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  render() {
    let top1 = 
        <Text style={{marginTop:isIOS?scaleSize(63):scaleSize(51), fontWeight:'bold', fontSize:scaleSize(60), color:'#ff3a49'}}>{this.props.data.sellname}</Text>
    let top2 = 
      <View style={{marginTop:isIOS?scaleSize(63):scaleSize(51), width:GlobalStyles.WINDOW_WIDTH, flexDirection:'row', alignItems:'flex-end'}}>
        <Text style={{marginLeft:scaleSize(148), fontWeight:'bold', fontSize:scaleSize(60), color:'#ff3a49'}}>{this.props.data.sellname}</Text>
        <Text style={{marginLeft:scaleSize(477), fontSize:scaleSize(48), color:'#998675'}}>剩余{' '+this.props.data.surplusmoney}元</Text>
      </View>

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0)'
        onPress={()=>{console.log('')}}>
        <View style={{marginTop:scaleSize(this.props.top),height:scaleSize(636), flexDirection:'column', alignItems:'center'}}>
          <ImageBackground 
            source={ImageStores.sy_19} 
            resizeMode={'stretch'} 
            style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(594), flexDirection:'column', alignItems:'center'}} >
            {this.props.data.surplusmoney?top2:top1}
            <Text style={{marginTop:scaleSize(81), fontWeight:'bold', fontSize:scaleSize(36), color:'#989898'}}>{'年化利率'}</Text>
            <View style={{marginTop:isIOS?scaleSize(30):scaleSize(24), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(90), flexDirection:'row', alignItems:'flex-end', justifyContent:'center'}}>
              <View style={{ height:scaleSize(72)}}>
                <Text style={{fontSize:scaleSize(72), fontWeight:'200', color:'#998675'}}>{this.props.data.expectedyearyield}</Text>
              </View>
              <View style={{ height:scaleSize(42)}}>
                <Text style={{fontSize:scaleSize(42), fontWeight:'200', color:'#998675'}}>{'%'}</Text>
              </View>
              <View style={{ height:scaleSize(54)}}>
                <Text style={{fontSize:scaleSize(54), fontWeight:'200', color:'#998675'}}>{' + '}</Text>
              </View>
              <View style={{ height:scaleSize(90)}}>
                <Text style={{fontSize:scaleSize(90), fontWeight:'200', color:'#ff3a49'}}>{this.props.data.improveyearrate}</Text>
              </View>
              <View style={{ height:scaleSize(54)}}>
                <Text style={{fontSize:scaleSize(54), fontWeight:'200', color:'#ff3a49'}}>{'%'}</Text>
              </View>
              <ImageBackground 
                source={ImageStores.sy_16}
                resizeMode={'stretch'}
                style={{position:'absolute', width:scaleSize(150), height:scaleSize(54), right:scaleSize(172), top:0, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(26), color:'#ff3a49'}}>{'出借奖励'}</Text>
              </ImageBackground>
            </View>
            <Text style={{marginTop:isIOS?scaleSize(54):scaleSize(48), fontSize:scaleSize(48), color:'#998675'}}>服务期限 {' '+this.props.data.expiresdays}天</Text>
          </ImageBackground>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={()=>{console.log('')}}
            style={{width:scaleSize(588), height:scaleSize(168), position:'absolute', bottom:0}}>
            <ImageBackground 
              source={this.props.data.buyStatus == '0' ?ImageStores.sy_17:ImageStores.cp_1} 
              resizeMode={'stretch'} 
              style={{width:scaleSize(588), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:this.props.data.buyStatus == '0'?'#FFFFFF':'#656565'}}>{this.props.data.display}</Text>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    )
  }
}
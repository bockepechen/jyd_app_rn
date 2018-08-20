import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  UIManager,
  Image,
  ImageBackground,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardMjz extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.paraData = this.props.data.item;
    this.state={
        isSelect:-1
    }
  }

  _onPress = () => {
    let index = this.props.id
    let select = index;
    if (this.state.isSelect === index){
        select = -1;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({
        isSelect: select
    })
    this.props.onPressItem(this.props.id,this.paraData,'item');
  };

  getcjjl(contractexpectamount,improverate){
    let res = parseFloat(contractexpectamount)*parseFloat(improverate)
    return res.toFixed(2)
  }

  getqjnhbl(expectedyearyield,improveyearrate){
    let res = parseFloat(expectedyearyield) + parseFloat(improveyearrate)
    res = res * 100
    return res.toFixed(2)
  }
  
  getzhglf(expectprofit,accountfeerate){
    let res = parseFloat(expectprofit)*parseFloat(accountfeerate)
    return res.toFixed(2)
  }

  getDate1(str){
    let array = []
    let array2 = []
    array = str.split('-')
    array2 = array[2].split(' ')
    let res = array[0]+'年'+array[1]+'月'+array2[0]+'日'
    return res
  }
  getDate2(str){
    let array = []
    array = str.split(' ')
    return array[0]
  }
  
  renderItem(item){
    return (
        <View style={{marginBottom:scaleSize(162),marginTop:scaleSize(40)}}>
            <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{marginLeft:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{'期待年回报率:'}</Text>
                    <Text style={{marginRight:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{`${this.getqjnhbl(item.expectedyearyield,item.improveyearrate)}%`}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                    <Text style={{marginLeft:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{'加入时间:'}</Text>
                    <Text style={{marginRight:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{this.getDate2(item.starttime)}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                    <Text style={{marginLeft:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{'账户管理费:'}</Text>
                    <Text style={{marginRight:scaleSize(165),fontSize:scaleSize(36),color:'#989898'}}>{`${this.getzhglf(item.expectprofit,item.accountfeerate)} 元`}</Text>
                </View>
            </View>
        </View>
    )
  }
  
  render() {
    return (
        <View>
            {/*每组的点击header*/}
            <TouchableOpacity
                style={{justifyContent:'center',alignItems:'center'}}
                activeOpacity={0.6}
                onPress={this._onPress}
            >
                <ImageBackground
                    source={ImageStores.cp_4_1}
                    resizeMode={'stretch'} 
                    style={{height:scaleSize(372),width:scaleSize(1242)}}
                >
                    <View style={{marginTop:scaleSize(54),flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'column',marginLeft:scaleSize(90)}}>
                            <Text style={{height:scaleSize(51),fontSize:scaleSize(42),color:'#656565',fontWeight:'bold'}}>{this.paraData.sellname}</Text>
                            <Text style={{marginTop:scaleSize(6),height:scaleSize(51),fontSize:scaleSize(36),color:'#989898'}}>{this.paraData.sellid}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{marginRight:scaleSize(24),height:scaleSize(51),fontSize:scaleSize(36),color:'#998675',fontWeight:'bold'}}>{`${this.getDate1(this.paraData.expectendtime)} 服务到期`}</Text>
                            <Image
                                source={this.state.isSelect === this.props.id ? ImageStores.fx_4_1 : ImageStores.fx_4}
                                resizeMode={'stretch'} 
                                style={{marginTop:scaleSize(-7),height:scaleSize(54),width:scaleSize(54),marginRight:scaleSize(81)}}
                            />
                        </View>
                    </View>
                    <View style={{marginTop:scaleSize(30),flexDirection:'row',justifyContent:'center'}}>
                        <View style={{}}>
                            <Text style={{fontSize:scaleSize(48),color:'#998675',height:scaleSize(48)}}>{this.paraData.contractamount}</Text>
                            <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(15)}}>{'出借金额(元)'}</Text>
                        </View>
                        <View style={{marginLeft:scaleSize(155)}}>
                            <Text style={{fontSize:scaleSize(48),color:'#998675',height:scaleSize(48)}}>{this.paraData.expectprofit}</Text>
                            <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(15)}}>{'预计利息(元)'}</Text>
                        </View>
                        <View style={{marginLeft:scaleSize(155)}}>
                            <Text style={{fontSize:scaleSize(48),color:'#ff3a49',height:scaleSize(48)}}>{this.getcjjl(this.paraData.contractexpectamount,this.paraData.improverate)}</Text>
                            <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(15)}}>{'出借奖励(元)'}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
            {/*每组的折叠item, 相等显示, 不等隐藏*/}
            {this.state.isSelect === this.props.id ? this.renderItem(this.paraData) : null}
        </View>
    )
  }
}
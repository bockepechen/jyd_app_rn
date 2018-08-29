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
import Utils from '../../utils/Utils';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardTbz extends Component {
  constructor(props) {
    super(props);
    this.paraData = this.props.data.item;
    this.state={
        isSelect:-1
    }
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id,this.paraData,'item');
  };

  getcjjl(contractamount,improverate){
    let res = parseFloat(contractamount)*parseFloat(improverate)
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

  getnhll(expectedyearyield){
    let res = parseFloat(expectedyearyield)
    res = res * 100
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

  goto(url,JsonObj){
    this.props.navigationParam.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }
  
  render() {
    return (
        <View>
            <ImageBackground
                source={ImageStores.me_15}
                resizeMode={'stretch'} 
                style={{height:scaleSize(909),width:scaleSize(1242)}}
            >
                <View style={{marginTop:scaleSize(66),flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',marginLeft:scaleSize(108)}}>
                        <Image
                            source={this.paraData.borrowtypeid == '1' ? ImageStores.me_28 : ImageStores.me_29}
                            resizeMode={'stretch'} 
                            style={{marginTop:scaleSize(-7),height:scaleSize(48),width:scaleSize(48),marginRight:scaleSize(27)}}
                        />
                        <Text style={{height:scaleSize(42),fontSize:scaleSize(36),color:'#656565',fontWeight:'bold'}}>{this.paraData.sellname}</Text>
                    </View>
                    <TouchableOpacity 
                        style={{flexDirection:'row',marginRight:scaleSize(108)}}
                        onPress={()=>{}}
                        activeOpacity={0.6}
                    >
                        <Text style={{marginRight:scaleSize(12),width:scaleSize(144),height:scaleSize(51),fontSize:scaleSize(36),color:'#998675',fontWeight:'bold'}}>{'查看详情'}</Text>
                        <Image
                            source={ImageStores.me_6}
                            resizeMode={'stretch'} 
                            style={{marginTop:scaleSize(-7),tintColor:'#998675',height:scaleSize(45),width:scaleSize(27)}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:scaleSize(32)}}>
                    <View style={{backgroundColor:'#f2f2f2', marginLeft:scaleSize(6), width:scaleSize(1059),height:0.5}}/>
                </View>
                <View style={{marginTop:scaleSize(60),flexDirection:'column'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'借款编号:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{this.paraData.borrowno}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'投标日期:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{this.getDate2(this.paraData.applytime)}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'投标金额:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.paraData.contractexpectamount} 元`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'年化利率:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.getnhll(this.paraData.expectedyearyield)}%`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'账户管理费:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.getzhglf(this.paraData.expectprofit,this.paraData.accountfeerate)} 元`}</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
  }
}
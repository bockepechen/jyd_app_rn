import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import Utils from '../../utils/Utils';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardCyz extends Component {
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
  
  ckht(){
    global.NetReqModel.business_id = this.paraData.id
    global.NetReqModel.compact_id = '01'
    global.NetReqModel.type_id = '02'
    console.log(JSON.stringify(global.NetReqModel))
    this.goto('WvItemPage',{
        url:"/esign/showLcCompact",
        jsonObj:global.NetReqModel,
        title:'查看合同'
    })
  }

  jkxy(){
    global.NetReqModel.business_id = this.paraData.relationid
    global.NetReqModel.compact_id = '02'
    global.NetReqModel.type_id = '02'
    console.log(JSON.stringify(global.NetReqModel))
    this.goto('WvItemPage',{
        url:"/esign/showLcCompact",
        jsonObj:global.NetReqModel,
        title:'借款协议'
    })
  }

  hkjh(){
    global.NetReqModel.borrow_id = this.paraData.borrowid
    global.NetReqModel.page_number = '1'
    console.log(JSON.stringify(global.NetReqModel))
    this.goto('WvItemPage',{
        url:"/productMore/queryReturnPlan",
        jsonObj:global.NetReqModel,
        title:'回款计划'
    })
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
                            source={this.paraData.borrowtypeid == '1' ? ImageStores.me_29 : ImageStores.me_28}
                            resizeMode={'stretch'} 
                            style={{marginTop:scaleSize(-7),height:scaleSize(48),width:scaleSize(48),marginRight:scaleSize(27)}}
                        />
                        <Text style={{height:scaleSize(42),fontSize:scaleSize(36),color:'#656565',fontWeight:'bold'}}>{this.paraData.description}</Text>
                    </View>
                    <TouchableOpacity 
                        style={{flexDirection:'row',marginRight:scaleSize(108)}}
                        onPress={()=>{
                            global.NetReqModel.BorrowId = this.paraData.borrowid;
                            this.goto('WvItemPage',{
                                url:"/productDetails/queryStandardpowderDetail",
                                jsonObj:global.NetReqModel,
                                title:'产品详情'
                            })
                        }}
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
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'起息日期:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{this.getDate2(this.paraData.starttime)}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'出借金额:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${Utils.formatMoney(this.paraData.contractamount,2)} 元`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'年化利率:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.getnhll(this.paraData.expectedyearyield)}%`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'预期利息:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${Utils.formatMoney(this.paraData.expectprofit,2)} 元`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'出借奖励:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.getcjjl(this.paraData.contractamount,this.paraData.improverate)} 元`}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:scaleSize(18)}}>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginLeft:scaleSize(165)}}>{'账户管理费:'}</Text>
                        <Text style={{fontSize:scaleSize(36),color:'#989898',marginRight:scaleSize(165)}}>{`${this.getzhglf(this.paraData.expectprofit,this.paraData.accountfeerate)} 元`}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(110)}}>
                    <TouchableOpacity
                        onPress={()=>{this.jkxy()}}
                        activeOpacity={0.6}
                        style={{height:scaleSize(84),width:scaleSize(243),backgroundColor:'#c7b299',justifyContent:'center',alignItems:'center',borderRadius:scaleSize(15)}}
                    >
                        <Text style={{color:'#fff',fontSize:scaleSize(42)}}>{'借款协议'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{this.ckht()}}
                        activeOpacity={0.6}
                        style={{height:scaleSize(84),marginLeft:scaleSize(24),width:scaleSize(243),backgroundColor:'#c7b299',justifyContent:'center',alignItems:'center',borderRadius:scaleSize(15)}}
                    >
                        <Text style={{color:'#fff',fontSize:scaleSize(42)}}>{'查看合同'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{this.hkjh()}}
                        activeOpacity={0.6}
                        style={{height:scaleSize(84),marginLeft:scaleSize(24),width:scaleSize(243),backgroundColor:'#c7b299',justifyContent:'center',alignItems:'center',borderRadius:scaleSize(15)}}
                    >
                        <Text style={{color:'#fff',fontSize:scaleSize(42)}}>{'回款计划'}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
  }
}
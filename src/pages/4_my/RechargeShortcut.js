import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {ImageStores} from '../../../res/styles/ImageStores';
import Utils from '../../utils/Utils';
import LoadingIcon from '../../common/LoadingIcon';

let isAndroid = Platform.OS==='android'?true:false;
export default class RechargeShortcut extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.tx_amount = ''
    this.state = {
      isLoading:false,
      card_no:'',
      bank_name:'',
    }
  }

  componentDidMount() {
    this.getInfoData()
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  async getInfoData() {
    this.setState({
      isLoading:true
    });
    let url = await '/accountSafety/cardInfo';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        this.setState({
            isLoading:false,
            card_no:result.card_no,
            bank_name:result.bank_name,
        })
      }
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
      global.NetReqModel.bank_transfer_url = result.bank_transfer_url;
    })
    .catch((e) => {
      console.log(e);
      // TODO Toast提示异常
      // 关闭Loading动画
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
    })
  }

  recharge() {
    // global.NetReqModel.tel_phone = '15822753827'
    global.NetReqModel.tx_amount = this.tx_amount
    // global.NetReqModel.tx_amount = 100
    // global.NetReqModel.jyd_pubData.user_id = '91'
    // global.NetReqModel.jyd_pubData.token_id = '123235h5e3111'
    console.log(JSON.stringify(global.NetReqModel))
    this.goto('RechargeBankPage',{
      url:'/directRecharge',
      jsonObj:global.NetReqModel,
      title:'充值'
    });
  }

  renderSubTitleLine(subTitle, topDistance) {
    return (
      <View style={{ flexDirection:'row', alignItems:'center', marginLeft:scaleSize(60), marginRight:scaleSize(60)}}>
        <ImageBackground 
          source={ImageStores.sy_14} 
          resizeMode={'stretch'} 
          style={{marginLeft:0, width:scaleSize(258), height:scaleSize(72), justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'#f2f2f2', fontSize:scaleSize(32)}}>{subTitle}</Text>
        </ImageBackground>
        <View style={{flex:1,backgroundColor:'#c7b299', marginLeft:scaleSize(6), width:scaleSize(870),height:0.5}}/>
      </View>
    )
  }

  renderRemark(){
    return (
        <View
            style={{
                flex:1,
                position:'absolute', 
                top:scaleSize(1150),
                width:GlobalStyles.WINDOW_WIDTH, 
                alignItems:'center',
            }}
        >
            {this.renderSubTitleLine('温馨提示')}
            <View style={{marginTop:scaleSize(66),marginLeft:scaleSize(110),marginRight:scaleSize(110)}}>
                <Text style={{fontSize:scaleSize(36), color:'#989898'}}>1、修改当前认证手机号码时,您的银行存管手机号码将会同步修改</Text>
                <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(18),color:'#989898'}}>2、如有问题,请联系客服400-8780-777</Text>
            </View>
        </View>
    )
}

  renderMainView() {
    let kbType = Platform.OS==='ios'?'number-pad':'numeric';
    return (
      <View 
        style={{
          position:'absolute', 
          top:scaleSize(51), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
        }}>
        <View style={{width:scaleSize(1134), height:scaleSize(550), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
            <TextInput 
              style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(48), paddingTop:0, paddingBottom:0}}
              editable={false}
              clearButtonMode={'while-editing'}
              placeholder={'银行账号'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
              value = {`${this.state.bank_name}(${this.state.card_no})`}
              />
          </View>
          <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
            <TextInput 
              style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
              clearButtonMode={'while-editing'}
              placeholder={'请输入银行预留手机号'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
              value = {this.state.tel_pwdOld}
              />
          </View>
          <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
            <TextInput 
              style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
              clearButtonMode={'while-editing'}
              placeholder={'请输入充值金额,不得少于100元'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText = {(p) => {this.tx_amount = p}}
              value = {this.tx_amount}
              />
          </View>
          <View style={{marginTop:scaleSize(42),width:scaleSize(999),flexDirection:'row',justifyContent:'flex-end'}}>
              <TouchableOpacity
                onPress={()=>{this.goto('RechargeLimitPage',{
                  url:'accountRecharge/limitTable',
                  JsonObj:global.NetReqModel
                })}}
              >
                <Text style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'查看银行限额'}</Text>
              </TouchableOpacity>
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
        <TouchableHighlight 
          style={{marginTop:scaleSize(45)}}
          underlayColor='rgba(0,0,0,0)'
          onPress={()=>{this.recharge()}}>
          <ImageBackground 
            source={ImageStores.sy_17} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'提交'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderMainView()}    
        {this.renderRemark()}  
        {this.state.isLoading?(<LoadingIcon />):null}  
      </View>
    )
  }
}
import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';
import LoadingIcon from '../../common/LoadingIcon';
import { AppConfig } from '../../config/AppConfig';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class BindCardPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.name = '';
        this.sfzno = '';
        this.cardno = '';
        this.tel = ''
        this.state = {
            isRotate:true,
            isLoading: false,
            isEyeOpen: false,
            validTime: 0,
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    async checkCoundDown(){
        this.adaptAuthCodeCD = await this.dataResponsitory.adaptAuthCodeCD();
        this.setState({
            validTime:!this.adaptAuthCodeCD.ifSendAuthCode ? this.adaptAuthCodeCD.authcodeCD : 0,
        })
    }

    navGoback = () => {
        this.props.navigation.goBack();
    }

    async goNext() {
        Keyboard.dismiss();
        if(!this.name || this.name == '') {
            this.refs.toast.show('姓名不能为空');
            return false;
        }
        else if(!this.sfzno || this.sfzno == ''){
            this.refs.toast.show('姓名不能为空');
            return false
        }
        else if(!this.cardno || this.cardno == ''){
            this.refs.toast.show('银行卡不能为空');
            return false
        }
        else if(!Utils.checkoutTel(this.tel)) {
          this.refs.toast.show('请输入正确手机号');
        }  else {
          // 启动Loading动画
          this.setState({isLoading:true});
          // 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
          let adaptAuthCodeCD = await this.dataResponsitory.adaptAuthCodeCD();
          // 跳转下页面参数设置
          let navigation_params = {
            pageTitle:'绑定银行卡',
            nextPage:'SetPwdPage',
            getSmsCodeUrl:'',
            tel: this.tel,
            cryptTel: `${this.telNum.substring(0,3)} **** ${this.tel.substring(7)}`,
            authcodeCD: adaptAuthCodeCD.authcodeCD
          };
          // 没有发送过验证码或者验证码过期，调用网络接口重新发送
          if (adaptAuthCodeCD.ifSendAuthCode) {
            // 设置远程接口访问参数 (同步执行)
            global.NetReqModel.tel_phone = await this.tel;
            global.NetReqModel.refer_code = await this.referCode;
            let url = await '/signIn/register';
            this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
             .then((result) => {
               // 返回数据，关闭Loading动画
               this.setState({isLoading:false}, () => {
                 if (result.return_code === '0000') {
                  this.props.navigation.navigate('SmsCodePage', navigation_params);
                 } else {
                  this.refs.toast.show(result.return_msg);
                 }
               })
             })
             .catch((e) => {
               this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
               // 关闭Loading动画
               if(this.state.isLoading) {
                 this.setState({isLoading:false});
               }
             })
          } else {
            this.setState({isLoading:false},() => {
              this.props.navigation.navigate('SmsCodePage', navigation_params);
            });
          }
        }
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
                    top:scaleSize(1450),
                    width:GlobalStyles.WINDOW_WIDTH, 
                    alignItems:'center',
                }}
            >
                {this.renderSubTitleLine('温馨提示')}
                <View style={{marginTop:scaleSize(66),marginLeft:scaleSize(100),marginRight:scaleSize(100)}}>
                    <Text style={{fontSize:scaleSize(36), color:'#989898'}}>1、江西银行为嘉e贷提供资金存管服务,为保障资金安全,请绑</Text>
                    <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(18),color:'#989898'}}>定您本人持有的储蓄卡,资金充值和提现必须使用同一张银行卡.</Text>
                    <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(18),color:'#989898'}}>2、如您绑定的银行卡未开通"银联在线支付"功能,绑卡后不能</Text>
                    <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(18),color:'#989898'}}>进行充值,需开通银联在线服务.</Text>
                </View>
            </View>
        )
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              position:'absolute', 
              top:scaleSize(117)+12, 
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(734), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <View style={{marginTop:scaleSize(81), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
                <TextInput 
                  style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'真实姓名'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.name}
                  onChangeText={(t) => {this.name=t}}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1, marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'身份证号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.sfzno = p}}
                  value={this.sfzno}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1, marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  maxLength={20}
                  keyboardType={kbType}
                  clearButtonMode={'while-editing'}
                  placeholder={'银行卡号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.pwd = p}}
                  />
                  <TouchableHighlight 
                    style={{marginRight:scaleSize(12)}}
                    underlayColor='rgba(0,0,0,0)'
                    onPress={this.switchVisible}>
                    <ImageBackground 
                        source={ImageStores.me_5}
                        resizeMode={'stretch'} style={{justifyContent:'center',alignItems:'center',width:scaleSize(249), height:scaleSize(84),marginTop:scaleSize(-50)}}
                    >
                        <Text style={{fontSize:scaleSize(36),color:'#fff'}}>{'查看限额'}</Text>
                    </ImageBackground>
                  </TouchableHighlight>
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1, marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  maxLength={11}
                  keyboardType={kbType}
                  clearButtonMode={'while-editing'}
                  placeholder={'手机号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  secureTextEntry={!this.state.isEyeOpen}
                  onChangeText = {(p) => {this.pwd = p}}
                  />
              </View>
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(56)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={this.nextPage}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'立即绑定'}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        )
      }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar 
                        title={'绑定银行卡'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                    />
                    <View>
                    <Image
                        source={ImageStores.dl_6}
                        resizeMode={'stretch'}
                        style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(456)}}/>
                        {this.renderInputView()}
                        {this.renderRemark()}
                </View>
                {this.state.isLoading?(<LoadingIcon />):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
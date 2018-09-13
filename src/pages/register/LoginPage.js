import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Animated,
  Easing,
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
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import { StackActions,NavigationActions } from 'react-navigation';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.navData = this.props.navigation.state.params;
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.telNum = global.NetReqModel.tel_phone;
    this.state = {
      logo_initPos: new Animated.Value(0),
      input_initPos: new Animated.Value(0),
      rotateValue: new Animated.Value(0),//旋转角度的初始值
      isRotate:true,
      isLoading: false,
      isEyeOpen: false,
    }
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.input_initPos, {
        duration:500,
        toValue: -60,
        easing: Easing.linear
      }),
      Animated.timing(this.state.logo_initPos, {
        duration:500,
        toValue: 60,
        easing: Easing.linear
      }),
    ]).start(()=>{'Animate start parallelly.'})
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  navGoback = () => {
    console.log(this.navData)
    if(this.navData && this.navData.data && this.navData.data.fromPage == 'home'){
      this.props.navigation.dispatch(StackActions.popToTop());
    }
    else{
      if(this.state.isLoading) {
        // 关闭Loading动画
        this.setState({isLoading:false}, () => {
          this.props.navigation.goBack();
        })
      } else {
        this.props.navigation.goBack();
      }
    }
  }

  switchVisible = () => {
    this.setState({
      isEyeOpen: !this.state.isEyeOpen
    })
  }

  login = async () => {
    Keyboard.dismiss();
    if(!this.telNum || !this.pwd) {
      this.refs.toast.show('手机号和密码不能为空');
    } else if(!Utils.checkoutTel(this.telNum)) {
      this.refs.toast.show('请输入正确手机号');
    } else {
      // 启动Loading动画
      this.setState({isLoading:true});
      // 设置远程接口访问参数 (同步执行)
      global.NetReqModel.tel_phone = await this.telNum;
      global.NetReqModel.tel_pwd = await this.pwd;
      global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
      console.log(JSON.stringify(global.NetReqModel));
      let url = await '/login';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
       .then((result) => {
         console.log(result)
         // 返回数据，关闭Loading动画
         this.setState({isLoading:false}, () => {
           if (result.return_code === '0000') {
             global.NetReqModel.jyd_pubData.user_id = result.user_data.user_id;
             global.NetReqModel.jyd_pubData.user_name = result.user_data.user_name;
             global.NetReqModel.red_envelop_total = result.user_data.red_envelop_total;
             global.NetReqModel.account_id = result.jx_data.account_id;
             global.NetReqModel.bank_no = result.jx_data.bank_no;
             global.NetReqModel.sign_status = result.jx_data.sign_status;
             global.NetReqModel.tradepwd_status = result.jx_data.tradepwd_status;
             this.dataResponsitory.saveLocalStorage(
              Storage_Key.LS_REG_USERINFO,
              {
                user_id: result.user_data.user_id,
                user_name: result.user_data.user_name,
                token_id: result.user_data.token_id,
                tel_phone : this.telNum,
                red_envelop_total : result.user_data.red_envelop_total,
                account_id : result.jx_data.account_id,
                bank_no : result.jx_data.bank_no,
                sign_status : result.jx_data.sign_status,
                tradepwd_status : result.jx_data.tradepwd_status,
              },
              () => {
                this.refs.toast.show('登录成功');
                this.props.navigation.dispatch(StackActions.popToTop());
              }
             )
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
    }
  }

  forgetPWD = async () => {
    Keyboard.dismiss();
    if(!this.telNum) {
      this.refs.toast.show('手机号不能为空');
    } else if(!Utils.checkoutTel(this.telNum)) {
      this.refs.toast.show('请输入正确手机号');
    } else {
      this.setState({isLoading:true});
      // 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
      let adaptAuthCodeCD = await this.dataResponsitory.adaptAuthCodeCD();
      // 跳转下页面参数设置
      let navigation_params = {
        pageTitle:'忘记密码',
        nextPage:'ResetPwdPage',
        tel: this.telNum,
        cryptTel: `${this.telNum.substring(0,3)} **** ${this.telNum.substring(7)}`,
        authcodeCD: adaptAuthCodeCD.authcodeCD
      };
      if  (adaptAuthCodeCD.ifSendAuthCode) {
        // 设置远程接口访问参数 (同步执行)
        global.NetReqModel.tel_phone = await this.telNum;
        global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
        let url = await '/password/forgetPwd';
        this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
         .then((result) => {
           // 返回数据，关闭Loading动画
           this.setState({isLoading:false}, () => {
             if (result.return_code === '0000') {
               global.NetReqModel.jyd_pubData.user_id = result.user_id;
               this.props.navigation.navigate('AuthPage', navigation_params);
             } else {
              this.refs.toast.show(result.return_msg);
             }
           })
         })
         .catch((e) => {
           console.log(e);
           this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
           // 关闭Loading动画
           if(this.state.isLoading) {
             this.setState({isLoading:false});
           }
         })
      } else {
        this.setState({isLoading:false},() => {
          this.props.navigation.navigate('AuthPage', navigation_params);
        });
      }
    }
  }

  goRegisterPage = () => {
    this.props.navigation.navigate('RegisterPage');
  }

  renderInputView() {
    let kbType = Platform.OS==='ios'?'number-pad':'numeric';
    return (
      <Animated.View 
        style={{
          position:'absolute', 
          top:scaleSize(117)+60, 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
          transform:[{translateY:this.state.input_initPos}],
        }}>
        <View style={{width:scaleSize(1134), height:scaleSize(426), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <View style={{marginTop:scaleSize(81), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
            <TextInput 
              style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
              maxLength={11}
              keyboardType={kbType}
              clearButtonMode={'while-editing'}
              placeholder={'手机号码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              defaultValue={this.telNum}
              onChangeText={(t) => {this.telNum=t}}
              />
          </View>
          <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
            <TextInput 
              style={{flex:1, marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
              maxLength={20}
              clearButtonMode={'while-editing'}
              placeholder={'登录密码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry={!this.state.isEyeOpen}
              onChangeText = {(p) => {this.pwd = p}}
              />
              <TouchableHighlight 
                style={{marginRight:scaleSize(12)}}
                underlayColor='rgba(0,0,0,0)'
                onPress={this.switchVisible}>
                <Image source={this.state.isEyeOpen?ImageStores.me_3:ImageStores.me_2} resizeMode={'stretch'} style={{width:scaleSize(69), height:scaleSize(54)}}/>
              </TouchableHighlight>
          </View>
          <View style={{marginTop:scaleSize(42), width:scaleSize(1134), height:20, alignItems:'flex-end'}}>
            <TouchableHighlight
              style={{marginRight:scaleSize(99)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={this.forgetPWD}>
              <Text style={{fontSize:scaleSize(36), color:'#3b92f0'}}>{'忘记密码'}</Text>
            </TouchableHighlight>
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
        <TouchableHighlight 
          style={{marginTop:scaleSize(42)}}
          underlayColor='rgba(0,0,0,0)'
          onPress={this.login}>
          <ImageBackground 
            source={ImageStores.sy_17} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'登 录'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </Animated.View>
    )
  }

  renderCorpLogo() {
    return (
      <Animated.View 
        style={{
          position:'absolute', 
          top:scaleSize(1215)-60, 
          // top:scaleSize(1215), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
          // transform: [{scale: this.state.springValue}],
          transform:[{translateY:this.state.logo_initPos}]
        }}>
        <Image source={ImageStores.dl_2} resizeMode={'stretch'} style={{width:scaleSize(288), height:scaleSize(288)}}/>
        <Text style={{marginTop:scaleSize(78), fontSize:scaleSize(36), fontWeight:'200', color:'#998675'}}>
          {`Copyright @ ${new Date().getFullYear()} jiayidai.com`}
        </Text>
      </Animated.View>
    )
  }
  
  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
        <View style={GlobalStyles.rootContainer}>
          <NavigationBar 
            title={'登录'}
            titleColor='#FFFFFF'
            titleSize={scaleSize(56)}
            navColor='#E8152E'
            statusBarColor='#E8152E'
            statusBarStyle='light-content'
            leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
            rightButton={ViewUtils.renderRightBtn('注册', this.goRegisterPage)}/>
          <View>
            <Image
              source={ImageStores.dl_6}
              resizeMode={'stretch'}
              style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(456)}}/>
            {this.renderInputView()}
            {this.renderCorpLogo()}
          </View>
          {this.state.isLoading?(<LoadingIcon />):null}
          {ViewUtils.renderToast()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
let styles = StyleSheet.create({
  
});
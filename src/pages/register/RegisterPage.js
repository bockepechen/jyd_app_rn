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
import {NetReqModel} from '../../Moidel/NetReqModel';
import LoadingIcon from '../../common/LoadingIcon';
import { AppConfig } from '../../config/AppConfig';

export default class RegisterPage extends Component {
  constructor(props){
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      logo_initPos: new Animated.Value(0),
      input_initPos: new Animated.Value(0),
      rotateValue: new Animated.Value(0),//旋转角度的初始值
      // springValue: new Animated.Value(0.3), //弹跳初始值
      isFillTel:false,
      isInviteCode:false,
      isRotate:true,
      isLoading: false,
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
      // Animated.spring(
      //   this.state.springValue,
      //   {
      //     toValue: 1,
      //     friction: 1
      //   }
      // )
    ]).start(()=>{'Animate start parallelly.'})
  }

  componentWillUnmount() {}

  navGoback = () => {
    if(this.state.isLoading) {
      // 关闭Loading动画
      this.setState({isLoading:false}, () => {
        this.props.navigation.goBack();
      })
    } else {
      this.props.navigation.goBack();
    }
  }

  changeTel = (tel) => {
    this.telNum = tel;
    if (tel.length === 11) {
      this.setState({isFillTel: true});
    } else {
      this.setState({isFillTel: false});
    }
  }

  showInviteCode = () => {
    this.setState({
      isInviteCode: !this.state.isInviteCode
    })
  }

  async goNext() {
    if(!Utils.checkoutTel(this.telNum)) {
      // TODO 电话号码验证未通过
      return false;
    } else {
      Keyboard.dismiss();
      // 启动Loading动画
      this.setState({isLoading:true});
      // 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
      let adaptAuthCodeCD = await this.adaptAuthCodeCD();
      // 没有发送过验证码或者验证码过期，调用网络接口重新发送
      if (adaptAuthCodeCD.ifSendAuthCode) {
        // 设置远程接口访问参数 (同步执行)
        NetReqModel.tel_phone = await this.telNum;
        NetReqModel.refer_code = await this.referCode;
        NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
        let url = await '/signIn/register';
        this.dataResponsitory.fetchNetResponsitory(url, NetReqModel)
         .then((result) => {
           console.log(result);
           // 返回数据，关闭Loading动画
           this.setState({isLoading:false}, () => {
             if (result.return_code === '0000') {
              this.props.navigation.navigate('AuthPage', {
                tel: this.telNum,
                cryptTel: `${this.telNum.substring(0,3)} **** ${this.telNum.substring(7)}`,
                authcodeCD: adaptAuthCodeCD.authcodeCD
              });
             } else {
              // TODO 返回错误信息，进行Toast提示返回错误信息，进行Toast提示
             }
           })
         })
         .catch((e) => {
           console.log(e);
           // TODO Toast提示异常
           // 关闭Loading动画
           if(this.state.isLoading) {
             this.setState({isLoading:false});
           }
         })
      } else {
        this.setState({isLoading:false},() => {
          this.props.navigation.navigate('AuthPage', {
            tel: this.telNum,
            cryptTel: `${this.telNum.substring(0,3)} **** ${this.telNum.substring(7)}`,
            authcodeCD: adaptAuthCodeCD.authcodeCD
          });
        });
      }
    }
  }

  adaptAuthCodeCD() {
    let result = {
      ifSendAuthCode: true,
      authcodeCD: AppConfig.AUTHCODE_CD
    }
    return new Promise((resolve) => {
      this.dataResponsitory.fetchLocalResponsitory(Storage_Key.LS_REG_COUNTDOWN)
      .then(res => {
        if(res) {
          let diff_time = res.currentCd - Utils.getInterval(res.timeStamp);
          if(diff_time > 0) {
            result.ifSendAuthCode = false;
            result.authcodeCD = diff_time;
          }
        }
        resolve(result);
      })
      .catch(e => {
        reject(result);
      })
    })
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
        <View style={{width:scaleSize(1134), height:this.state.isInviteCode?scaleSize(426):scaleSize(282), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <View style={{marginTop:scaleSize(81), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
            <TextInput 
              style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
              maxLength={11}
              keyboardType={kbType}
              clearButtonMode={'while-editing'}
              placeholder={'手机号码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={this.changeTel}
              />
          </View>
          <TouchableOpacity 
            style={{marginTop:scaleSize(36), flexDirection:'row', alignItems:'center'}}
            onPress={this.showInviteCode}>
            <View style={{borderWidth:0, justifyContent:'center', height:scaleSize(36)}}>
            <Image source={this.state.isInviteCode?ImageStores.dl_8:ImageStores.dl_7} resizeMode={'stretch'} style={{width:scaleSize(36), height:scaleSize(36)}}/>
            </View>
            <Text style={{marginLeft:scaleSize(21), fontSize:scaleSize(36), color:'#c3c3c3'}}>{'我有推荐码'}</Text>
          </TouchableOpacity>
          {
            this.state.isInviteCode?
              (
                <View style={{marginTop:scaleSize(30), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
                  <TextInput 
                    style={{marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
                    maxLength={11}
                    keyboardType={kbType}
                    clearButtonMode={'while-editing'}
                    placeholder={'推荐人手机号码 (选填)'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText = {(code) => {this.referCode = code}}
                    />
                </View>
              ):null
          }
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
        <TouchableHighlight 
          style={{marginTop:scaleSize(42)}}
          underlayColor='rgba(0,0,0,0)'
          onPress={()=>{this.state.isFillTel?this.goNext():null}}>
          <ImageBackground 
            source={this.state.isFillTel?ImageStores.sy_17:ImageStores.cp_1} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:this.state.isFillTel?'#FFFFFF':'#656565'}}>{'下一步'}</Text>
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
            title={'注册'}
            titleColor='#FFFFFF'
            titleSize={scaleSize(56)}
            navColor='#E8152E'
            statusBarColor='#E8152E'
            statusBarStyle='light-content'
            leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}/>
          <View>
            <Image
              source={ImageStores.dl_6}
              resizeMode={'stretch'}
              style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(456)}}/>
            {this.renderInputView()}
            {this.renderCorpLogo()}
          </View>
          {this.state.isLoading?(<LoadingIcon />):null}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
let styles = StyleSheet.create({
  
});
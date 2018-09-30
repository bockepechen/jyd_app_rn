import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  DeviceEventEmitter
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import AuthCode from './AuthCode';
import DataResponsitory, {Storage_Key} from '../../dao/DataResponsitory';
import { AppConfig } from '../../config/AppConfig';
import LoadingIcon from '../../common/LoadingIcon';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class SmsCodePage extends Component {
  constructor(props){
    super(props);
    this.navData = this.props.navigation.state.params;
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state = {
      validTime: this.navData.authcodeCD,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.authCode_countDown();
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.AndroidBackHandler.removePressBackListener();
  }

  authCode_countDown() {
    this.timer = setInterval(() => {
      console.log(this.state.validTime);
      if (this.state.validTime === 0) {
        clearInterval(this.timer);
        console.log('倒数结束');
      } else {
        this.setState({
          validTime: this.state.validTime - 1
        })
      }
    }, 1000);
  }

  navGoback = () => {
    // 将验证码有效CD保存到本地缓存
    this.dataResponsitory.saveLocalStorage(
      Storage_Key.LS_REG_COUNTDOWN, 
      {
        currentCd: this.state.validTime,
        timeStamp: Date.now()
      }, 
      () => {
        this.props.navigation.goBack();
      }
    );
  }

  finishInput = async (t) => {
    Keyboard.dismiss();
    // 启动Loading动画
    this.setState({isLoading:true});
    global.NetReqModel.tel_code = await t;
    let url = await this.navData.nextApi;
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        // 返回数据，关闭Loading动画
        this.setState({isLoading:false}, () => {
          if (result.return_code === '0000') {
            clearInterval(this.timer);
            this.refs.toast.show('签订成功');
            // 针对签约页面的处理，如果一项签约成功，还要返回到签约页面，并通过DeviceEventEmitter方式，重新刷新页面签约状态
            DeviceEventEmitter.emit('refreshSignInfo');
            this.props.navigation.navigate(this.navData.nextPage);
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

  reSendAuthCode = async () => {
    // 重置倒计时，开启倒计时
    this.setState({validTime: AppConfig.AUTHCODE_CD}, () => {
      this.authCode_countDown();
    });
    let url = await '/signCompact/sendMobileCode';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        // 返回数据，关闭Loading动画
        this.setState({isLoading:false}, () => {
          if (result.return_code === '0000') {
            // TODO 重新发送成功
          } else {
            // 发送未成功，立即停止倒计时
            clearInterval(this.timer);
            this.setState({validTime:0})
            this.refs.toast.show(result.return_msg);
          }
        })
      })
      .catch((e) => {
        // 发送未成功，立即停止倒计时
        clearInterval(this.timer);
        this.setState({validTime:0})
        this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
        // 关闭Loading动画
        if(this.state.isLoading) {
          this.setState({isLoading:false});
        }
      })
  }

  renderAuthCodeView() {
    return (
      <View 
        style={{
          position:'absolute', 
          top:scaleSize(117), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
        }}>
        <View style={{width:scaleSize(1134), height:scaleSize(426), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <Text style={{marginTop:scaleSize(75), fontSize:scaleSize(48), color:'#998675'}}>{'请输入验证码'}</Text>
          <AuthCode
            callback={this.finishInput}/>
          <View style={{marginTop:scaleSize(60), width:scaleSize(999), flexDirection:'row'}}>
          <Text style={{fontSize:scaleSize(36), color:'#c3c3c3'}}>{`未收到短信验证码 `}</Text>
          {
            this.state.validTime !== 0?
              (<Text style={{fontSize:scaleSize(36), color:'#c3c3c3'}}>{` ${this.state.validTime}秒后重新获取 `}</Text>):
              (
                <TouchableHighlight
                  style={{borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#E8152E'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={this.reSendAuthCode}>
                  <Text 
                    style={{fontSize:scaleSize(36), color:'#E8152E'}}>
                    {`重新获取`}
                  </Text>
                </TouchableHighlight>
              )
          }
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
        <View style={{marginTop:scaleSize(30), alignItems:'center'}}>
          <Text style={{fontSize:scaleSize(54), color:'rgba(232,21,46,0.6)'}}>{'短信验证码已发送至'}</Text>
          <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(90), color:'rgba(232,21,46,0.6)'}}>{this.navData.cryptTel}</Text>
        </View>
      </View>
    )
  }

  renderCorpLogo() {
    return (
      <View 
        style={{
          position:'absolute', 
          top:scaleSize(1215), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
        }}>
        <Image source={ImageStores.dl_2} resizeMode={'stretch'} style={{width:scaleSize(288), height:scaleSize(288)}}/>
        <Text style={{marginTop:scaleSize(78), fontSize:scaleSize(36), fontWeight:'200', color:'#998675'}}>
          {`Copyright @ ${new Date().getFullYear()} jiayidai.com`}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <View style={GlobalStyles.rootContainer}>
          <NavigationBar 
            title={this.navData.pageTitle}
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
              {this.renderAuthCodeView()}
              {this.renderCorpLogo()}
          </View>
          {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
          {ViewUtils.renderToast()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
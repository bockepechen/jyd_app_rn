import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
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
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class ResetPwdPage extends Component {
  constructor(props){
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state = {
      isLoading: false,
      isEyeOpen: false,
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

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

  resetPwd = async () => {
    Keyboard.dismiss();
    if(!this.newPwd) {
      this.refs.toast.show('新密码不能为空');
    } else if(!Utils.checkoutPWD(this.newPwd)) {
      this.refs.toast.show('新密码必须包含6-20位数字和字母');
    } else if(this.newPwd !== this.newPwdConfirm) {
      this.refs.toast.show('两次输入的密码不一样');
    } else {
      // 启动Loading动画
      this.setState({isLoading:true});
      // 设置远程接口访问参数 (同步执行)
      global.NetReqModel.tel_pwd = await this.newPwd;
      let url = await '/password/resetPwd';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
       .then((result) => {
         console.log(result);
         // 返回数据，关闭Loading动画
         this.setState({isLoading:false}, () => {
           if (result.return_code === '0000') {
             global.NetReqModel.jyd_pubData.user_id = result.user_id;
             global.NetReqModel.jyd_pubData.user_name = result.user_name;
             this.dataResponsitory.saveLocalStorage(
              Storage_Key.LS_REG_USERINFO,
              {
                user_id: result.user_id,
                user_name: result.user_name,
                token_id: global.NetReqModel.jyd_pubData.token_id
              },
              () => {
                this.refs.toast.show('密码重置成功，请继续登录', 1000, () => {
                  this.props.navigation.navigate('LoginPage');
                });
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

  renderInputView() {
    return (
      <View 
        style={{
          position:'absolute', 
          top:scaleSize(117), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
        }}>
        <View style={{width:scaleSize(1134), height:scaleSize(426), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <View style={{marginTop:scaleSize(114), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
            <TextInput 
              style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
              maxLength={20}
              clearButtonMode={'while-editing'}
              placeholder={'请设置6-20位数字和字母作为登录密码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry={true}
              onChangeText={(p) => {this.newPwd=p}}
              />
          </View>
          <View style={{marginTop:scaleSize(81), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3'}}>
            <TextInput 
              style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
              maxLength={20}
              clearButtonMode={'while-editing'}
              placeholder={'请再次输入新密码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry={true}
              onChangeText={(p) => {this.newPwdConfirm=p}}
              />
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
        <TouchableHighlight 
          style={{marginTop:scaleSize(42)}}
          underlayColor='rgba(0,0,0,0)'
          onPress={this.resetPwd}>
          <ImageBackground 
            source={ImageStores.sy_17} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'确 认'}</Text>
          </ImageBackground>
        </TouchableHighlight>
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
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
        <View style={GlobalStyles.rootContainer}>
          <NavigationBar 
            title={'重置密码'}
            titleColor='#FFFFFF'
            titleSize={scaleSize(56)}
            navColor='#E8152E'
            statusBarColor='#E8152E'
            statusBarStyle='light-content'
            leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)} />
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
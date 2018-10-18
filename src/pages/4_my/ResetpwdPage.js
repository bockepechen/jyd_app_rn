import React, { Component } from 'react';
import {
  Platform,
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
import LoadingIcon from '../../common/LoadingIcon';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import Utils from '../../utils/Utils';

export default class ResetpwdPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isRotate:true,
            isLoading: false,
            isEyeOpen: false,
            tel_pwdOld:'',
            tel_pwdNew:'',
            tel_pwdNewRe:'',
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    switchVisible = () => {
        this.setState({
            isEyeOpen: !this.state.isEyeOpen
        })
    }

    resetpwd = async () => {
        if(this.state.tel_pwdOld == '')
        {
          this.refs.toast.show('输入内容不能为空');
          return false;
        }
        if(this.state.tel_pwdNew == ''){
          this.refs.toast.show('新密码不能为空');
          return false;
        }
        if(this.state.tel_pwdNew != this.state.tel_pwdNewRe){
          this.refs.toast.show('两次输入的密码不一致');
          return false;
        }
        if(!Utils.checkoutPWD(this.state.tel_pwdNew)){
          this.refs.toast.show('新密码必须包含6-20位数字和字母');
          return false;
        }
        if(this.state.tel_pwdNew.indexOf(" ") != -1){
          this.refs.toast.show('新密码必须包含6-20位数字和字母');
          return false;
        }
        this.setState({isLoading:true});
        // 设置远程接口访问参数 (同步执行)
        global.NetReqModel.tel_phone = await global.NetReqModel.tel_phone;
        // global.NetReqModel.tel_phone = await '15822854761';
        global.NetReqModel.tel_pwdOld = this.state.tel_pwdOld
        global.NetReqModel.tel_pwdNew = this.state.tel_pwdNew
        console.log(JSON.stringify(global.NetReqModel))
        let url = await '/password/changePassword';
        this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
         .then((result) => {
           console.log(result)
           // 返回数据，关闭Loading动画
           this.setState({isLoading:false}, () => {
             if (result.return_code === '0000') {
              this.refs.toast.show('修改成功');
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
    }

    navGoback = () => {
        this.props.navigation.goBack();
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

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              position:'absolute', 
              top:scaleSize(117)+15, 
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(550), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(48), paddingTop:0, paddingBottom:0}}
                  maxLength={20}
                  clearButtonMode={'while-editing'}
                  placeholder={'当前密码'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
                  value = {this.state.tel_pwdOld}
                  secureTextEntry={!this.state.isEyeOpen}
                  />
                  <TouchableHighlight 
                    style={{marginRight:scaleSize(12)}}
                    underlayColor='rgba(0,0,0,0)'
                    onPress={this.switchVisible}>
                    <Image source={this.state.isEyeOpen?ImageStores.me_3:ImageStores.me_2} resizeMode={'stretch'} style={{width:scaleSize(69), height:scaleSize(54)}}/>
                  </TouchableHighlight>
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(48), paddingTop:0, paddingBottom:0}}
                  maxLength={20}
                  clearButtonMode={'while-editing'}
                  placeholder={'新密码需为6-20位字母与数字的组合'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdNew:p})}}
                  value = {this.state.tel_pwdNew}
                  secureTextEntry={!this.state.isEyeOpen}
                  />
                  <TouchableHighlight 
                    style={{marginRight:scaleSize(12)}}
                    underlayColor='rgba(0,0,0,0)'
                    onPress={this.switchVisible}>
                    <Image source={this.state.isEyeOpen?ImageStores.me_3:ImageStores.me_2} resizeMode={'stretch'} style={{width:scaleSize(69), height:scaleSize(54)}}/>
                  </TouchableHighlight>
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(48), paddingTop:0, paddingBottom:0}}
                  maxLength={20}
                  clearButtonMode={'while-editing'}
                  placeholder={'请再次输入新密码'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdNewRe:p})}}
                  value = {this.state.tel_pwdNewRe}
                  secureTextEntry={!this.state.isEyeOpen}
                  />
                  <TouchableHighlight 
                    style={{marginRight:scaleSize(12)}}
                    underlayColor='rgba(0,0,0,0)'
                    onPress={this.switchVisible}>
                    <Image source={this.state.isEyeOpen?ImageStores.me_3:ImageStores.me_2} resizeMode={'stretch'} style={{width:scaleSize(69), height:scaleSize(54)}}/>
                </TouchableHighlight>
              </View>
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(56)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={this.resetpwd}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'确认'}</Text>
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
                        title={'修改登录密码'}
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
                        {/* {this.renderRemark()} */}
                </View>
                {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
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
import { getLastUpdateTime } from 'react-native-device-info';

export default class AccountOpeningPage extends Component{
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
        if(this.state.tel_pwdOld == '' || this.state.tel_pwdNew == '' || this.state.tel_pwdNewRe == '')
        {
          this.refs.toast.show('输入内容不能为空');
          return false;
        }
        if(this.state.tel_pwdNew != this.state.tel_pwdNewRe){
          this.refs.toast.show('新密码前后输入的不一致');
          return false;
        }
        this.setState({isLoading:true});
        // 设置远程接口访问参数 (同步执行)
        // global.NetReqModel.tel_phone = await 'global.NetReqModel.tel_phone';
        global.NetReqModel.tel_phone = await '15822854761';
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
                    // position:'absolute', 
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

    renderStepImg(){
      return (
        <View style={{width:GlobalStyles.WINDOW_WIDTH,marginTop:scaleSize(102)}}>
          <View style={{width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}>
            <Image 
              source={ImageStores.me_12}
              resizeMode={'stretch'}
              style={{width:scaleSize(774), height:scaleSize(144)}}
            />
          </View>
          <View style={{marginTop:scaleSize(33),flexDirection:'row'}}>
            <Text style={{marginLeft:scaleSize(195),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'开通存管账号'}</Text>
            <Text style={{marginLeft:scaleSize(102),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'设置交易密码'}</Text>
            <Text style={{marginLeft:scaleSize(120),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'签订协议'}</Text>
          </View>
        </View>
      )
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              marginTop:scaleSize(93),
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(699), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'真实姓名'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
                  value = {this.state.tel_pwdOld}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'身份证号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
                  value = {this.state.tel_pwdOld}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'选择银行'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
                  value = {this.state.tel_pwdOld}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'手机号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.setState({tel_pwdOld:p})}}
                  value = {this.state.tel_pwdOld}
                  />
              </View>
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(42)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={this.resetpwd}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontWeight:'bold' ,fontSize:scaleSize(36),color:'#FFFFFF'}}>{'开通江西银行存管账号'}</Text>
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
                        title={'银行存管账号'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                    />
                    <View>
                    <ImageBackground
                        source={ImageStores.me_1}
                        resizeMode={'stretch'}
                        style={{width:scaleSize(1242), height:scaleSize(837)}}>
                      {this.renderStepImg()}
                      {this.renderInputView()}
                      {this.renderRemark()}
                    </ImageBackground>
                </View>
                {this.state.isLoading?(<LoadingIcon />):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
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

export default class ResetpwdPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isRotate:true,
            isLoading: false,
            isEyeOpen: false,
            httpRes:{},
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
        this.getInfoData();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    async getInfoData() {
      this.setState({
        isLoading:true
      });
      let url = await '/accountSafety/userInfo';
      console.log(JSON.stringify(global.NetReqModel));
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if(result.return_code == '0000'){
          this.setState({
              isLoading:false,
              httpRes : result,
          })
        }
        if(this.state.isLoading) {
          this.setState({isLoading:false});
        }
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
        global.NetReqModel.tel_phone = await 'global.NetReqModel.tel_phone';
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

    renderRemark(){
        return (
            <View
                style={{
                  marginTop:scaleSize(105),
                    width:GlobalStyles.WINDOW_WIDTH, 
                    alignItems:'center',
                }}
            >
                <View style={{marginTop:scaleSize(66),marginLeft:scaleSize(110),marginRight:scaleSize(110)}}>
                    <Text style={{fontSize:scaleSize(36), color:'#989898'}}>(南昌银行已经更名为江西银行，如收不到江西银行，可选择南昌银行或者城市商业银行，开户地为江西省南昌市))</Text>
                    <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(36),color:'#656565'}}>江西银行客服电话:400-78-96266</Text>
                </View>
            </View>
        )
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              marginTop:scaleSize(159), 
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{backgroundColor:'#ffffff',alignItems:'center'}}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'真实姓名'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.real_name ? this.state.httpRes.real_name : ''}
                    />
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'身份证号'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.card_no ? this.state.httpRes.card_no : ''}
                    />
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',  height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'电子账户'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.account_id ? this.state.httpRes.account_id : ''}
                    />
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'预留手机号'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.tel_phone ? this.state.httpRes.tel_phone : ''}
                    />
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'开户行'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.bank_name ? this.state.httpRes.bank_name : ''}
                    />
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:scaleSize(135), borderBottomWidth:scaleSize(2), borderBottomColor:'#f2f2f2', flexDirection:'row', alignItems:"center",}}>
                <Text style={{flex:1,fontSize:scaleSize(42),color:'#989898',marginLeft:scaleSize(102)}}>{'开户支行'}</Text>
                <View>
                  <TextInput 
                    style={{marginRight:scaleSize(102),flex:1,color:'#989898' , fontSize:scaleSize(42), paddingTop:0, paddingBottom:0}}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor='#c3c3c3'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    editable={false}
                    value={this.state.httpRes && this.state.httpRes.sub_bank_name ? this.state.httpRes.sub_bank_name : ''}
                    />
                </View>
              </View>
            </View>
          </View>
        )
      }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar 
                        title={'江西银行存管'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                    />
                    <View>
                      <ImageBackground
                          source={ImageStores.dl_6}
                          resizeMode={'stretch'}
                          style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(456),justifyContent:'center',alignItems:'center'}}
                      >
                        <Image 
                          source={ImageStores.yh_18}
                          resizeMode={'stretch'}
                          style={{width:scaleSize(558),height:scaleSize(117),marginTop:scaleSize(-100)}}
                        />
                      </ImageBackground>
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
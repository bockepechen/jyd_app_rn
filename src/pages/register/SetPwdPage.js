import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import Utils from '../../utils/Utils';
import DataResponsitory, {Storage_Key} from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import {NavigationActions, StackActions} from 'react-navigation'

export default class SetPwdPage extends Component {
  constructor(props){
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state={
      isEyeOpen: false,
      isFillPwd: false,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }
  
  navGoback = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
  }

  switchVisible = () => {
    this.setState({
      isEyeOpen: !this.state.isEyeOpen
    })
  }

  changePwd = (pwd) => {
    this.passWord = pwd;
    if (pwd.length >= 6) {
      this.setState({isFillPwd: true});
    } else {
      this.setState({isFillPwd: false});
    }
  }

  doneReg = async () => {
    if(!Utils.checkoutPWD(this.passWord)) {
      this.refs.toast.show('请设置6-20位数字和字母作为登录密码');
    } else {
      Keyboard.dismiss();
      // 启动Loading动画
      this.setState({isLoading:true});
      global.NetReqModel.tel_pwd = await this.passWord;
      global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
      let url = await '/signIn/setPassword';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
        .then((result) => {
          // 返回数据，关闭Loading动画
          this.setState({isLoading:false}, () => {
            if (result.return_code === '0000') {
              // TODO 跳转到指定的App页面
              global.NetReqModel.jyd_pubData.user_id = result.user_id;
              this.dataResponsitory.saveLocalStorage(
              Storage_Key.LS_REG_USERINFO,
              {
                user_id: result.user_id,
                token_id: global.NetReqModel.jyd_pubData.token_id,
                tel_phone : global.NetReqModel.tel_phone,
              },
              () => {
                this.refs.toast.show('注册成功', 1000, () => {
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'TabPage'}),
                    ],
                  });
                  this.props.navigation.dispatch(resetAction);
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

  renderPWDView() {
    return (
      <View 
        style={{
          position:'absolute', 
          top:scaleSize(117), 
          width:GlobalStyles.WINDOW_WIDTH, 
          alignItems:'center',
        }}>
        <View style={{width:scaleSize(1134), height:scaleSize(426), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
          <Text style={{marginTop:scaleSize(75), fontSize:scaleSize(48), color:'#998675'}}>{'请设置登录密码'}</Text>
          <View style={{marginTop:scaleSize(72), width:scaleSize(999), height:scaleSize(93), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center", borderWidth:0}}>
            <TextInput 
              style={{flex:1, marginLeft:scaleSize(18), marginRight:scaleSize(12), fontSize:scaleSize(48), paddingTop:0, paddingBottom:0, borderWidth:0}}
              maxLength={20}
              clearButtonMode={'while-editing'}
              placeholder={'请设置登录密码'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry={!this.state.isEyeOpen}
              onChangeText={this.changePwd}
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
          style={{marginTop:scaleSize(42)}}
          underlayColor='rgba(0,0,0,0)'
          onPress={this.doneReg}>
          <ImageBackground 
            source={this.state.isFillPwd?ImageStores.sy_17:ImageStores.cp_1} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:this.state.isFillPwd?'#FFFFFF':'#656565'}}>{'完成注册'}</Text>
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

  render(){
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
              {this.renderPWDView()}
              {this.renderCorpLogo()}
          </View>
          {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
          {ViewUtils.renderToast()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

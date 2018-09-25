import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Image,
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
import CheckBox from 'react-native-check-box'
import { StackActions } from 'react-navigation';

export default class AccountAgreementPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isLoading: false,
            jx_status : '0',
            xy_status : '0',
            sqs_status : '0',
            jxBank_compactUrl : '',
            readtzxy:false,
            readzzxy:false,
            readjfxy:false,
            readsqxy:false,
            readcjsqs:false
        }
        // global.NetReqModel.tel_phone = '15822854761'
        // global.NetReqModel.jyd_pubData.user_id  = '198'
        // global.NetReqModel.jyd_pubData.token_id = 'kbZBtBHxGXKPRAXDmk2sZMNDM6Fm8MZw'
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
        this.getInfoData()
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    async getInfoData() {
      this.setState({isLoading:true})
      let url = await '/signStatus';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if(result.return_code = '0000'){
          this.setState({
            isLoading:false,
            jx_status : result.jx_status,
            xy_status : result.xy_status,
            sqs_status : result.sqs_status,
            jxBank_compactUrl : result.jxBank_compactUrl,
            readtzxy : result.jx_status == '1' ? true : false,
            readzzxy : result.jx_status == '1' ? true : false,
            readjfxy : result.jx_status == '1' ? true : false,
            readsqxy : result.xy_status == '1' ? true : false,
            readcjsqs : result.sqs_status == '1' ? true : false,
          })
        }
      })
      .catch((e) => {
        console.log(e);
        if(this.state.isLoading){
          this.setState({isLoading:false})
        }
      })
    }

    switchVisible = () => {
        this.setState({
            isEyeOpen: !this.state.isEyeOpen
        })
    }

    navGoback = () => {
      this.props.navigation.dispatch(StackActions.popToTop());
    }

    goto(url,JsonObj){
      this.props.navigation.navigate(url,{
        data:JsonObj ? JsonObj : {},
        onGoBack: () => this.getInfoData(),
      });
    }

    checkyqb(compact_id,titlename){
      console.log('aaaaa');
      global.NetReqModel.compact_id = compact_id
      this.goto('AccountAgreementSignPage',{
        url:'/signCompact/previewCompactTemp',
        jsonObj:global.NetReqModel,
        title:titlename
      })
    }

    checkyqbDone(compact_id,titlename){
      global.NetReqModel.compact_id = compact_id
      this.goto('AccountAgreementSignPage',{
        url:'/esign/showSqs',
        jsonObj:global.NetReqModel,
        title:titlename
      })
    }

    showXy(titlename){
      this.goto('QualificationItemPage',{
        url:this.state.jxBank_compactUrl,
        jsonObj:global.NetReqModel,
        title:titlename
      })
    }

    async signyqb(compact_id,titlename){
      this.telNum = global.NetReqModel.tel_phone
      global.NetReqModel.compact_id = compact_id
      Keyboard.dismiss();
      this.setState({isLoading:true});
        // 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
        let adaptAuthCodeCD = await this.dataResponsitory.adaptAuthCodeCD();
        // 跳转下页面参数设置
        let navigation_params = {
          pageTitle:titlename,
          nextPage:'',
          nextApi:'/signCompact/eSignCompact',
          tel: this.telNum,
          cryptTel: `${this.telNum.substring(0,3)} **** ${this.telNum.substring(7)}`,
          authcodeCD: adaptAuthCodeCD.authcodeCD,
          compact_id:compact_id
        };
        if  (adaptAuthCodeCD.ifSendAuthCode) {
          // 设置远程接口访问参数 (同步执行)
          let url = await '/signCompact/sendMobileCode';
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
             console.log(e);
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

    renderStepImg(){
      return (
        <View style={{width:GlobalStyles.WINDOW_WIDTH,marginTop:scaleSize(102)}}>
          <View style={{width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}>
            <Image 
              source={ImageStores.me_14}
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

    renderTop(){
      return (
        <View>
          <View style={{marginTop:scaleSize(87),marginLeft:scaleSize(111)}}>
              <Text onPress={()=>{this.showXy('江西银行存管投资协议')}} style={{fontSize:scaleSize(42),fontWeight:'bold',color:'#998675'}}>{'江西银行存管投资协议'}</Text>
          </View>
          <View style={{marginTop:scaleSize(87),marginLeft:scaleSize(111)}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管投资协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
                  disabled = {this.state.jx_status == '1' ? true : false}
                  onClick={()=>{
                    this.setState({
                      readtzxy:!this.state.readtzxy
                    })
                  }}
                  isChecked={this.state.readtzxy}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
            <View style={{flexDirection:'row',marginTop:scaleSize(42)}}>
              <Text onPress={()=>{this.showXy('江西银行存管投资协议')}}  style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管债转协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
                  disabled = {this.state.jx_status == '1' ? true : false}
                  onClick={()=>{
                    this.setState({
                      readzzxy:!this.state.readzzxy
                    })
                  }}
                  isChecked={this.state.readzzxy}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
            <View style={{flexDirection:'row',marginTop:scaleSize(42)}}>
              <Text onPress={()=>{this.showXy('江西银行存管投资协议')}} style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管缴费协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
                  disabled = {this.state.jx_status == '1' ? true : false}
                  onClick={()=>{
                    this.setState({
                      readjfxy:!this.state.readjfxy
                    })
                  }}
                  isChecked={this.state.readjfxy}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
          </View>
          <View style={{marginTop:scaleSize(87),flexDirection:'row',justifyContent:'center'}}>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>{
                  if(this.state.jx_status == '1'){
                    return false
                  }
                  else if(this.state.readtzxy && this.state.readzzxy && this.state.readjfxy){
                    this.goto('AccountAgreementSignPage',{
                      url:'/termsAuth',
                      jsonObj:global.NetReqModel,
                      title:'立即签订'
                    })
                  }else{
                    this.refs.toast.show('请阅读上面三个协议后再签订');
                  }
                }}
              >
                <ImageBackground 
                  source={this.state.jx_status == '1' ? ImageStores.me_11 : ImageStores.me_5}
                  resizeMode={'stretch'}
                  style={{height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
                >
                  <Text style={{color:this.state.jx_status == '1' ? '#ff3a49' : '#fff',fontSize:scaleSize(36)}}>{`${this.state.jx_status == '1' ? '已签订' : '立即签订' }`}</Text>
                </ImageBackground>
              </TouchableHighlight>
          </View>
        </View>
      )
    }

    renderLine(){
      return (
        <View style={{justifyContent:'center',alignItems:'center',marginTop:scaleSize(78)}}>
          <View style={{width:scaleSize(1008),borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3'}}></View>
        </View>
      )
    }

    renderFooterOne(){
      return (
        <View style={{alignItems:'center'}}>
          <View style={{marginTop:scaleSize(57),flexDirection:'row',justifyContent:'space-between',width:scaleSize(1008)}}>
            <View style={{marginLeft:scaleSize(48),flexDirection:'column',alignItems:'flex-start'}}>
              <Text style={{fontSize:scaleSize(42),marginTop:scaleSize(27),fontWeight:'bold',color:'#998675'}}>{'电子签章用户授权协议'}</Text>
              <Text 
                onPress={()=>{
                  if(this.state.xy_status == '1'){
                    this.checkyqbDone('02','电子签章用户授权协议')
                  }else{
                    this.checkyqb('02','电子签章用户授权协议')
                  }
                }}  
                style={{fontSize:scaleSize(36),marginTop:scaleSize(27),color:'#3b92f0'}}>{'《电子签章用户授权协议》'}</Text>
              <CheckBox
                  style={{marginTop:scaleSize(27)}}
                  disabled = {this.state.xy_status == '1' ? true : false}
                  onClick={()=>{
                    this.setState({
                      readsqxy:!this.state.readsqxy
                    })
                  }}
                  isChecked={this.state.readsqxy}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
            <View style={{marginRight:scaleSize(51),flexDirection:'column',justifyContent:'center'}}>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>{
                  if(this.state.xy_status == '1'){
                    return false;
                  }
                  else if(this.state.readsqxy){
                    this.signyqb('02','电子签章用户授权协议');
                  }
                  else{
                    this.refs.toast.show('请阅读协议后再签订');
                  }
                }}
                style={{marginTop:scaleSize(-20)}}
              >
                <ImageBackground
                  source={this.state.xy_status == '1' ? ImageStores.me_11 : ImageStores.me_5}
                  resizeMode={'stretch'}
                  style={{height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
                >
                  <Text style={{color:this.state.xy_status == '1' ? '#ff3a49' : '#fff',fontSize:scaleSize(36)}}>{`${this.state.xy_status == '1' ? '已签订' : '立即签订' }`}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    }

    renderFooterTwo(){
      return (
        <View style={{alignItems:'center'}}>
          <View style={{marginTop:scaleSize(57),flexDirection:'row',justifyContent:'space-between',width:scaleSize(1008)}}>
            <View style={{marginLeft:scaleSize(48),flexDirection:'column',alignItems:'flex-start'}}>
              <Text style={{fontSize:scaleSize(42),marginTop:scaleSize(27),fontWeight:'bold',color:'#998675'}}>{'出借授权书'}</Text>
              <Text 
                onPress={()=>{
                  if(this.state.sqs_status == '1'){
                    this.checkyqbDone('01','出借授权书')
                  }else{
                    this.checkyqb('01','出借授权书')
                  }
                }}  
                style={{fontSize:scaleSize(36),marginTop:scaleSize(27),color:'#3b92f0'}}>{'《出借授权书》'}</Text>
              <CheckBox
                  style={{marginTop:scaleSize(27)}}
                  onClick={()=>{
                    this.setState({
                      readcjsqs:!this.state.readcjsqs
                    })
                  }}
                  disabled = {this.state.sqs_status == '1' ? true : false}
                  isChecked={this.state.readcjsqs}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
            <View style={{marginRight:scaleSize(51),flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>{
                  if(this.state.sqs_status == '1'){
                    return false;
                  }
                  else if(this.state.readcjsqs){
                    this.signyqb('01','出借授权书');
                  }
                  else{
                    this.refs.toast.show('请阅读协议后再签订');
                  }
                }}
                style={{marginTop:scaleSize(-20)}}
              >
                <ImageBackground
                  source={this.state.sqs_status == '1' ? ImageStores.me_11 : ImageStores.me_5}
                  resizeMode={'stretch'}
                  style={{height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
                >
                  <Text style={{color:this.state.sqs_status == '1' ? '#ff3a49' : '#fff',fontSize:scaleSize(36)}}>{`${this.state.sqs_status == '1' ? '已签订' : '立即签订' }`}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
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
            <View style={{width:scaleSize(1134), height:scaleSize(1374), backgroundColor:'#ffffff', borderRadius:10}}>
              {this.renderTop()}
              {this.renderLine()}
              {this.renderFooterOne()}
              {this.renderFooterTwo()}
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
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
                    </ImageBackground>
                </View>
                {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
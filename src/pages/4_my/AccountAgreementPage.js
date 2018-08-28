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
import CheckBox from 'react-native-check-box'

export default class AccountAgreementPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isLoading: false,
            readtzxy:false,
            readzzxy:false,
            readjfxy:false,
            readsqxy:false,
            readcjsqs:false
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

    navGoback = () => {
        this.props.navigation.goBack();
    }

    goto(url,JsonObj){
      this.props.navigation.navigate(url,{
        data:JsonObj ? JsonObj : {}
      });
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
              <Text style={{fontSize:scaleSize(42),fontWeight:'bold',color:'#998675'}}>{'江西银行存管投资协议'}</Text>
          </View>
          <View style={{marginTop:scaleSize(87),marginLeft:scaleSize(111)}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管投资协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
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
              <Text style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管债转协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
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
              <Text style={{fontSize:scaleSize(36),color:'#3b92f0'}}>{'《江西银行资金存管缴费协议》'}</Text>
              <CheckBox
                  style={{flexDirection:'row',marginLeft:scaleSize(201)}}
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
                onPress={()=>{
                  if(this.state.readtzxy && this.state.readzzxy && this.state.readjfxy){
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
                  source={ImageStores.me_5}
                  resizeMode={'stretch'}
                  style={{height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
                >
                  <Text style={{color:'#fff',fontSize:scaleSize(36)}}>{'立即签订'}</Text>
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
              <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(27),color:'#3b92f0'}}>{'《电子签章用户授权协议》'}</Text>
              <CheckBox
                  style={{marginTop:scaleSize(27)}}
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
              <ImageBackground
                source={ImageStores.me_11}
                resizeMode={'stretch'}
                style={{marginTop:scaleSize(-20),height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
              >
                <Text style={{color:'#ff3a49',fontSize:scaleSize(36)}}>{'已签订'}</Text>
              </ImageBackground>
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
              <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(27),color:'#3b92f0'}}>{'《出借授权书》'}</Text>
              <CheckBox
                  style={{marginTop:scaleSize(27)}}
                  onClick={()=>{
                    this.setState({
                      readcjsqs:!this.state.readcjsqs
                    })
                  }}
                  isChecked={this.state.readcjsqs}
                  checkedImage={<Image source={ImageStores.me_17} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  unCheckedImage={<Image source={ImageStores.me_18} resizeMode={'stretch'} style={{width:scaleSize(42), height:scaleSize(42)}}/>}
                  rightTextView={<Text style={{marginLeft:scaleSize(18),fontSize:scaleSize(36),color:'#c3c3c3'}}>{'已阅读'}</Text>}
              />
            </View>
            <View style={{marginRight:scaleSize(51),flexDirection:'column',justifyContent:'center'}}>
              <ImageBackground
                source={ImageStores.me_5}
                resizeMode={'stretch'}
                style={{marginTop:scaleSize(-20),height:scaleSize(84),width:scaleSize(216),justifyContent:'center',alignItems:'center'}}
              >
                <Text style={{color:'#fff',fontSize:scaleSize(36)}}>{'已签订'}</Text>
              </ImageBackground>
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
                {this.state.isLoading?(<LoadingIcon />):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
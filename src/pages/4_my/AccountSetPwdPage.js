import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  WebView,
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import { AppConfig } from '../../config/AppConfig';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import BufferUtils from '../../utils/BufferUtils'

export default class AccountSetPwdPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.navData = this.props.navigation.state.params.data;
        let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
        let baseP = new BufferUtils(encodeStr).toString('base64');
        this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
        this.wv_url = this.navData.url;
        console.log(this.wv_url);
        this.state = {
            isRotate:true,
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

    _onNavigationStateChange = (navState) => {
      console.log(navState)
      
      this.backButtonEnabled =  navState.canGoBack
      this.forwardButtonEnabled = navState.canGoForward
      this.wv_url = navState.url
    }
  
    sendMessage() {
      
    }

    handleMessage(e) {
    
    }

    navGoback = () => {
        this.props.navigation.goBack();
    }

    renderStepImg(){
      return (
        <View style={{width:GlobalStyles.WINDOW_WIDTH,marginTop:scaleSize(102)}}>
          <View style={{width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}>
            <Image 
              source={ImageStores.me_13}
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
            <View style={{width:scaleSize(1134), height:scaleSize(1300), backgroundColor:'#ffffff', borderRadius:10}}>
              <WebView 
                ref={"webview"}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scrollEnabled={true}
                source={{uri:this.wv_url}}
                onNavigationStateChange={this._onNavigationStateChange}
                startInLoadingState={true}
                onMessage={(e) => {
                  this.handleMessage(e)
                }}
              />
            </View>
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
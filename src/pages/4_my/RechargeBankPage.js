import React, { Component } from 'react';
import {
  Text,
  View,
  WebView,
  Platform,
  StyleSheet,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ViewUtils from '../../utils/ViewUtils'
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import {AppConfig} from '../../config/AppConfig';
import { StackActions } from 'react-navigation';

export default class RechargeBankPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.backButtonEnabled = ''
    this.forwardButtonEnabled = ''
    this.wv_url = ''
    this.state = {
      wv_url:this.navData.url,
    }
  }
  
  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }
  
  _onNavigationStateChange = (navState) => {
    console.log(navState)
    if(navState.url == 'action://jydapp.forgetPassword'){
      console.log('aaaaaaa');
      this.props.navigation.goBack();
      return false
    }else if(navState.url == 'action://jydapp'){
      console.log('bbbbbb');
      this.goto('RechargeResultPage',{
        title:'充值成功',
        type:'1'
      })
      return false
    }
    else if(navState.url == 'action:jiayidai'){
      console.log('333');
      this.props.navigation.goBack();
    }else{

    }
    this.backButtonEnabled =  navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
  }

  sendMessage() {
    
  }


  goBack = () => {
    if (this.state.backButtonEnabled) {
      this.refs.webview.goBack()
    } else {
      this.props.navigation.goBack();
    }
  }
  handleMessage(e) {
    
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
      <NavigationBar 
        title={this.navData.title}
        titleColor='#FFFFFF'
        titleSize={scaleSize(56)}
        navColor='#E8152E'
        statusBarColor='#E8152E'
        statusBarStyle='light-content'
        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.goBack)}
        />
        <WebView 
          ref={"webview"}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={true}
          // source={{uri:'http://10.2.0.155:8099/JYD_RN_Serv/userMail/readAnnouncement',method: 'POST', body: JSON.stringify(this.navData.jsonObj)}}
          source={{uri:this.state.wv_url,method: 'POST', body: JSON.stringify(this.navData.jsonObj)}}
          onNavigationStateChange={this._onNavigationStateChange}
          startInLoadingState={true}
          onMessage={(e) => {
            this.handleMessage(e)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
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
import { StackActions,NavigationActions } from 'react-navigation';
import BufferUtils from '../../utils/BufferUtils'

export default class MyGoldPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    this.navData.jsonObj.myHeight = GlobalStyles.WINDOW_HEIGHT - GlobalStyles.NAVBAR_HEIGHT - GlobalStyles.STATUSBAR_HEIGHT
    let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
    let baseP = new BufferUtils(encodeStr).toString('base64');
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.backButtonEnabled = ''
    this.forwardButtonEnabled = ''
    this.wv_url = this.navData.url
    this.status = ''
    this.loading =  ''
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
    let u = navState.url;
    if(navState.url.indexOf('action://9987') > -1){
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'LoginPage'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    if(navState.url == 'action://jydapp.forgetPassword'){
      console.log('aaaaaaa');
      this.props.navigation.goBack();
      return false
    }
    else if(navState.url == 'action://jydapp'){
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
    }
    else if(u.indexOf("tel:")  >= 0 ){
      console.log('aaaaaa');
      this.refs.webview.stopLoading()
      return false;
    }
    else{

    }
    console.log('bbbbbbb');
    this.backButtonEnabled =  navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
  }

  sendMessage() {
    
  }


  goBack = () => {
    if (this.backButtonEnabled) {
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
          scrollEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri:this.wv_url}}
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
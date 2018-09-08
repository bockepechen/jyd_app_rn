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
import { StackActions,NavigationActions } from 'react-navigation';
import {AppConfig} from '../../config/AppConfig';
import BufferUtils from '../../utils/BufferUtils'

export default class SignInPage extends Component {
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

  _onNavigationStateChange = (navState) => {
    console.log(navState);
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
    if(navState.url.indexOf('action://9986') > -1){
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'AccountOpeningPage'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    if(navState.url.indexOf('action://9970') > -1){
      global.NetReqModel.user_ip = global.NetReqModel.jyd_pubData.ip
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'BindCardNewPage',params: {
            data:{
              url:'/bindCard',
            jsonObj:global.NetReqModel,
            title:'绑定银行卡'
            }
          }}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    if(navState.url.indexOf('action://9985') > -1){
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'AccountSetPwdPage',params: {
            data:{
              url:'/bindCard',
            jsonObj:global.NetReqModel,
            title:'绑定银行卡'
            }
          }}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    if(navState.url.indexOf('action://9984') > -1){
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'AccountAgreementPage'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    this.backButtonEnabled = navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
    this.status = navState.title
    this.loading =  navState.loading
  }

  sendMessage() {
    // console.log(this.navData.jsonObj)
    // console.log(JSON.stringify(this.navData.jsonObj))
    // this.refs.webview.postMessage(JSON.stringify(this.navData.jsonObj));
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
          scrollEnabled={false}
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
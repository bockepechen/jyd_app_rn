import React, { Component } from 'react';
import {
  View,
  WebView,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ViewUtils from '../../utils/ViewUtils'
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import { StackActions,NavigationActions } from 'react-navigation';
import {AppConfig} from '../../config/AppConfig';
import BufferUtils from '../../utils/BufferUtils'

export default class JeyxListItemDetail extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    this.navData.jsonObj.myHeight = GlobalStyles.WINDOW_HEIGHT - GlobalStyles.NAVBAR_HEIGHT - GlobalStyles.STATUSBAR_HEIGHT
    let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
    let baseP = new BufferUtils(encodeStr).toString('base64');
    console.log(baseP);
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.ifbackhome = false
    this.backButtonEnabled = ''
    this.forwardButtonEnabled = ''
    this.wv_url = this.navData.url
  }
  
  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('reFreshEmitter', {});
    // if(this.ifbackhome)
    //   DeviceEventEmitter.emit('navreset', {tab:'Home'});
    this.AndroidBackHandler.removePressBackListener();
  }

  _onNavigationStateChange = (navState) => {
    console.log(navState)
    if(navState.url.indexOf('9987') > -1){
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
    if(navState.url.indexOf('action://RechargePage') > -1){
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'TabPage'}),
          NavigationActions.navigate({ routeName: 'RechargePage'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      return false
    }
    if(navState.url.indexOf('action://jydapp') > -1){
      console.log('aaaaaaa');
      this.ifbackhome = true
      this.props.navigation.dispatch(StackActions.popToTop());
      return false
    }
    this.backButtonEnabled = navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
    this.status = navState.title
    this.loading = navState.loading;
  }

  _onShouldStartLoadWithRequest = (e) => {
    console.log('========================= 精选散标Webview控件 ==============================');
    console.log(e.url);
    if (e.url.indexOf('9987') > -1) {
      this.props.navigation.navigate('RegisterPage');
      return false;
    }
    return true;
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
          // source={{uri:this.state.wv_url}}
          source={{uri:this.wv_url}}
          // source={require('./wv.html')}
          onNavigationStateChange={this._onNavigationStateChange}
          // onShouldStartLoadWithRequest = {this._onShouldStartLoadWithRequest}
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
import React, { Component } from 'react';
import {
  Text,
  View,
  WebView,
  Platform,
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
import BufferUtils from '../../utils/BufferUtils';
import {PublicCode} from '../../dao/PublicCode';
import CommonBlocker from '../../utils/CommonBlocker';

export default class JeyxListItemDetail extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
    let baseP = new BufferUtils(encodeStr).toString('base64');
    console.log(baseP);
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.commonBlocker = new CommonBlocker(this);
    this.ifbackhome = false
    this.backButtonEnabled = ''
    this.forwardButtonEnabled = ''
    this.wv_url = this.navData.url
  }
  
  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  //页面将要离开的是时候发送通知
  componentWillUnmount(){
    DeviceEventEmitter.emit('reFreshEmitter', {});
    // if(this.ifbackhome)
    //   DeviceEventEmitter.emit('navreset', {tab:'Home'});
    this.AndroidBackHandler.removePressBackListener();
  }

  _onNavigationStateChange = (navState) => {
    if (this.commonBlocker.handleLocalServCode(navState.url)) {
      this.commonBlocker.handleJXReturnCode(navState.url);
    }
    this.backButtonEnabled = navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
    this.status = navState.title
    this.loading = navState.loading;
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
          // source={require('./wv.html')}
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
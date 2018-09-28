import React, { Component } from 'react';
import {
  View,
  WebView,
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
import CommonBlocker from '../../utils/CommonBlocker';

export default class MallPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    console.log(this.navData.jsonObj);
    let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
    let baseP = new BufferUtils(encodeStr).toString('base64');
    console.log(baseP);
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.commonBlocker = new CommonBlocker(this);
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
    console.log(navState)
    if (this.commonBlocker.handleLocalServCode(navState.url)) {
      this.commonBlocker.handleJXReturnCode(navState.url);
    }
    // if(navState.url.indexOf('action://9987') > -1){
    //   const resetAction = StackActions.reset({
    //     index: 1,
    //     actions: [
    //       NavigationActions.navigate({ routeName: 'TabPage'}),
    //       NavigationActions.navigate({ routeName: 'LoginPage'}),
    //     ],
    //   });
    //   this.props.navigation.dispatch(resetAction);
    //   return false
    // }
    this.backButtonEnabled = navState.canGoBack
    this.forwardButtonEnabled = navState.canGoForward
    this.wv_url = navState.url
    this.status = navState.title
    this.loading =  navState.loading
  }

  sendMessage() {
    this.refs.webview.postMessage(JSON.stringify(this.navData.jsonObj));
  }


  goBack = () => {
    if (this.backButtonEnabled) {
      this.refs.webview.goBack()
    } else {
      this.props.navigation.goBack();
    }
  }
  handleMessage(e) {
    let obj = eval('('+e.nativeEvent.data+')');
    if(obj.key == '1'){
      this.sendMessage();
    }
    else if(obj.key == '2'){
      this.props.navigation.dispatch(StackActions.popToTop());
    }else{

    }
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
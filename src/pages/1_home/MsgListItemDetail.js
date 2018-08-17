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

export default class MsgListItemDetail extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url
    this.AndroidBackHandler = new AndroidBackHandler(this);
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

  _onNavigationStateChange = (navState) => {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      wv_url: navState.url,
      status: navState.title,
      loading: navState.loading,
    });
  }

  sendMessage() {
    // this.refs.webview.postMessage(this.navData.id);
    console.log(this.navData.jsonObj)
    this.refs.webview.postMessage(JSON.stringify(this.navData.jsonObj));
  }


  goBack = () => {
    if (this.state.backButtonEnabled) {
      this.refs.webview.goBack()
    } else {
      this.props.navigation.goBack();
    }
  }
  handleMessage(e) {
    console.log('aaaaaaa');
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
          scrollEnabled={false}
          // source={{uri:this.state.wv_url}}
          // source={{uri:'http://rz23ra.natappfree.cc/product1412/html/bindingJoinSucceed.html'}}
          // source={{uri:'http://localhost:9002/test/wv.html'}}
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
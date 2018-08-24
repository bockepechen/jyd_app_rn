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

export default class RechargeLimitPage extends Component {
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
          scrollEnabled={false}
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
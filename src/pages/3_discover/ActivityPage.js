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
import { StackActions } from 'react-navigation';
import {PublicCode} from '../../dao/PublicCode';

export default class ActivityPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
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
    console.log(navState)
    if(navState.url.indexOf(PublicCode.LOCAL_SERV_ACTIVITYAREA_PRODUCT) > -1){
      DeviceEventEmitter.emit('navreset', {tab:'Loan'});
      this.props.navigation.navigate('TabPage');
      return false
    }else if(navState.url.indexOf(PublicCode.LOCAL_SERV_ACTIVITYAREA_SHARE) > -1){
      this.props.navigation.navigate('InvitingFriendsPage');
      return false
    }
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      wv_url: navState.url,
      status: navState.title,
      loading: navState.loading,
    });
  }

  sendMessage() {
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
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // scrollEnabled={false}
          source={{uri:this.state.wv_url}}
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
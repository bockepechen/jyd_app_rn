import React, { Component } from 'react';
import {
  View,
  WebView,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ViewUtils from '../../utils/ViewUtils'
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import {AppConfig} from '../../config/AppConfig';
import { StackActions } from 'react-navigation';
import BufferUtils from '../../utils/BufferUtils';
import CommonBlocker from '../../utils/CommonBlocker';


export default class AccountOpeningWvPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    let encodeStr = encodeURIComponent(JSON.stringify(this.navData.jsonObj))
    let baseP = new BufferUtils(encodeStr).toString('base64');
    this.navData.url = AppConfig.REQUEST_HOST+this.navData.url + '?p='+baseP
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.commonBlocker = new CommonBlocker(this);
    this.wv_url = this.navData.url
  }
  
  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }
  
  _onNavigationStateChange = (navState) => {
    if (this.commonBlocker.handleJXReturnCode(navState.url, {
      page: 'AccountAgreementPage',
      emitType: 'refreshSignInfo'
    })) {
      this.commonBlocker.handleLocalServCode(navState.url);
    }
    this.wv_url = navState.url
  }

  goBack = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
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
        />
      </View>
    )
  }
}
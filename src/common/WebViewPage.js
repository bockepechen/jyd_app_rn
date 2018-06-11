import React, { Component } from 'react';
import {
  Text,
  View,
  WebView,
  Platform,
  StyleSheet,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import {GlobalStyles} from '../../res/styles/GlobalStyles';
import ViewUtils from '../utils/ViewUtils'

export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
    this.state = {
      wv_url:this.navData.url,
    }
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

  goBack = () => {
    if (this.state.backButtonEnabled) {
      this.refs.webview.goBack()
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
      <NavigationBar 
        title={this.navData.title}
        titleColor='#4A4A4A'
        titleSize={18}
        navColor='#FFFFFF'
        statusBarColor='#AAAAAA'
        statusBarStyle='light-content'
        leftButton={ViewUtils.renderBackBtn('#4A4A4A', this.goBack)}/>
        <WebView 
          ref={"webview"}
          source={{uri:this.state.wv_url}}
          onNavigationStateChange={this._onNavigationStateChange}
          startInLoadingState={true}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
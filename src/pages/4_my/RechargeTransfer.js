import React, { Component } from 'react';
import {
  Text,
  View,
  WebView,
} from 'react-native';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';

export default class RechargeTransfer extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
    }
  }

  componentDidMount() {
    
  }

  renderMainView() {
    return(
      <WebView 
        ref={"webview"}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{uri:global.NetReqModel.bank_transfer_url}}
        // onNavigationStateChange={this._onNavigationStateChange}
        startInLoadingState={true}
        // onMessage={(e) => {
        //   this.handleMessage(e)
        // }}
      />
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderMainView()}    
      </View>
    )
  }
}
import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
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
      <View>
          <Text>aaa</Text>
      </View>
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
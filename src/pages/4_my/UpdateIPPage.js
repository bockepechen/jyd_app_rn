import React, { Component } from 'react';
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {AppConfig} from '../../config/AppConfig';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';

let isAndroid = Platform.OS==='android'?true:false;
export default class UpdateIPPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.ip = AppConfig.REQUEST_HOST
  }

  componentDidMount() {
  }

  updateip(){
    AppConfig.REQUEST_HOST = this.ip
  }

  navGoback = () => {
    this.props.navigation.goBack();
}

  render() {
    return (
      <View style={{flex:1,marginTop:scaleSize(51)}}>
      <NavigationBar 
                    title='银行卡'
                    titleColor='#FFFFFF'
                    titleSize={scaleSize(56)}
                    navColor='#E8152E'
                    statusBarColor='#E8152E'
                    statusBarStyle='light-content'
                    leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                />
        <TextInput 
            style={{marginTop:100,backgroundColor:'#fff'}}
            onChangeText={(t) => {this.ip=t}}
            value={this.ip}
        />
        <TouchableOpacity 
         style={{marginTop:100,}}
            onPress={()=>{
                this.updateip()
            }}
        >
            <Text>确定</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
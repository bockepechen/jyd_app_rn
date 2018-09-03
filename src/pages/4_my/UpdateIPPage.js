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
import {AsyncStorage} from 'react-native'

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
    AsyncStorage.setItem('appId', this.ip, (error) => {
      if (error) {
        return false;
      } else {
        this.refs.toast.show('设置成功');
        return true;
      }
    })
  }

  navGoback = () => {
    this.props.navigation.goBack();
}

  render() {
    return (
      <View style={{flex:1}}>
      <NavigationBar 
                    title='改ip'
                    titleColor='#FFFFFF'
                    titleSize={scaleSize(56)}
                    navColor='#E8152E'
                    statusBarColor='#E8152E'
                    statusBarStyle='light-content'
                    leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                />
        <TextInput 
            // style={{marginTop:scaleSize(0), marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(54), paddingTop:0, paddingBottom:0}}
            // clearButtonMode={'while-editing'}
            // underlineColorAndroid='rgba(0,0,0,0)'
            defaultValue={this.ip}
            onChangeText={(t) => {this.ip=t}}
        />
        <TouchableOpacity 
         style={{marginTop:100,}}
            onPress={()=>{
                this.updateip()
            }}
        >
            <Text>确定</Text>
        </TouchableOpacity>
        {ViewUtils.renderToast()}
      </View>
    )
  }
}
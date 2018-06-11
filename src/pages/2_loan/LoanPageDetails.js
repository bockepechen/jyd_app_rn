import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ViewUtils from '../../utils/ViewUtils';

export default class LoanPageDetails extends Component {
  constructor(props) {
    super(props);
    this.navData = this.props.navigation.state.params.data;
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  render() {
    
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
        title={this.navData.title}
        titleColor='#4A4A4A'
        navColor='#FFFFFF'
        statusBarColor='#AAAAAA'
        statusBarStyle='light-content'
        leftButton={ViewUtils.renderBackBtn('#4A4A4A', this.navGoback)}/>
        <View key={'product_basic_info'}
          style={{
            backgroundColor:'#7EC0EE',
            height:300,
            alignItems:'center',
            justifyContent:'center'
          }}>
          <Text style={{fontSize:20}}>{this.navData.title+'  6.24%'}</Text>
        </View>
        <ScrollView>
          <View style={{
            backgroundColor:'#F0F0F0',
            height:350,
            justifyContent:'space-between'
          }}>
            <View style={{
              marginTop:100,
              alignItems:'center',
              justifyContent:'center',
            }}>
            <Text>{'借款产品详细信息...'}</Text>
            </View>
            <TouchableOpacity style={{
              backgroundColor:'#FF3030',
              height:40,
              borderRadius:5,
              marginLeft:15,
              marginRight:15,
              alignItems:'center',
              justifyContent:'center',
            }}>
              <Text style={{fontSize:18, color:'white'}}>{'立即出借'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
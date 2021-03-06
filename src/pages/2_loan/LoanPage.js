import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import {AppConfig} from '../../config/AppConfig';
import DataResponsitory from '../../dao/DataResponsitory';
import {scaleSize} from '../../utils/FitViewUtils';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TabJeyx from './TabJeyx';
import TabJxsb from './TabJxsb';

export default class LoanPage extends PureComponent {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.scrollableTabTitle = ['嘉e优选','精选散标']
  }

  componentWillMount() {
    // let url = AppConfig.REQUEST_HOST+'/rd/getListData';
    let url = AppConfig.REQUEST_HOST_PRO+'/AuthorityM_Serv/logout/test';
  }

  renderScrollableTabView() {
    return (
      <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        tabBarBackgroundColor='#F0F0F0'
        tabBarInactiveTextColor='#656565'
        tabBarActiveTextColor='#c7b299'
        tabBarTextStyle={{fontSize:scaleSize(42)}}
        tabBarUnderlineStyle={{
          backgroundColor:'#c7b299',
          height:scaleSize(2),
        }}>

        <TabJeyx key={'jeyx'} tabLabel={'嘉e优选'} {...this.props}/>
        <TabJxsb key={'jxsb'} tabLabel={'精选散标'} {...this.props}/>
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='出借'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'/>
        {this.renderScrollableTabView()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  
})
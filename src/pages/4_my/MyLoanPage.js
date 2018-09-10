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
import ViewUtils from '../../utils/ViewUtils';
import TabJeyx from './TabJeyx';
import TabSbjq from './TabSbjq';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class MyLoanPage extends PureComponent {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.scrollableTabTitle = ['嘉e优选','精选散标']
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  navGoback = () => {
    this.props.navigation.goBack();
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
        <TabSbjq key={'sbjq'} tabLabel={'散标债券'} {...this.props}/>
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
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
        />
        {this.renderScrollableTabView()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  
})
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HomePage from '../1_home/HomePage';
import LoanPage from '../2_loan/LoanPage';
import DiscoverPage from '../3_discover/DiscoverPage';
import MyPage from '../4_my/MyPage';
import SplashScreen from 'react-native-splash-screen';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

const popularIcon = require('../../../res/images/ic_polular.png');
const trendingIcon = require('../../../res/images/ic_trending.png');
const favoriteIcon = require('../../../res/images/ic_favorite.png');
const myIcon = require('../../../res/images/ic_my.png');

export default class TabPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  renderTabNavigator(Component, selectedTab, title, renderIcon, badgeText) {
    return (
      <TabNavigator.Item 
        selected={this.state.selectedTab === selectedTab}
        selectedTitleStyle={{color:'#436EEE'}}
        title={title}
        renderIcon={() => <Image style={styles.tabIcon} source={renderIcon} />}
        renderSelectedIcon={() => <Image style={[styles.tabIcon,{tintColor:'#436EEE'}]} source={renderIcon} />}
        onPress={() => {
          this.setState({selectedTab:selectedTab});
        }} 
        badgeText={badgeText?badgeText:''} >
        <Component {...this.props}/>
      </TabNavigator.Item>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <TabNavigator 
          tabBarStyle={{backgroundColor:'rgba(255,255,255,0.8)'}}
          sceneStyle={{height:GlobalStyles.WINDOW_HEIGHT+100}}
          >
          {this.renderTabNavigator(HomePage, 'Home', '首页', popularIcon)}
          {this.renderTabNavigator(LoanPage, 'Loan', '出借', trendingIcon)}
          {this.renderTabNavigator(DiscoverPage, 'Dicover', '发现', favoriteIcon)}
          {this.renderTabNavigator(MyPage, 'My', '我的', myIcon)}
        </TabNavigator>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 22,
    height: 22
  },
});
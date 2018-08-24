import React, { PureComponent } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  BackHandler
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RechargeShortcut from './RechargeShortcut';
import RechargeTransfer from './RechargeTransfer';
import ViewUtils from '../../utils/ViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

let isAndroid = Platform.OS==='android'?true:false;
export default class RechargePage extends PureComponent {
  constructor(props) {
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.scrollableTabTitle = ['快捷充值','银行转账']
    this.state = {
        isLoading : false,
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  componentWillMount() {
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

        <RechargeShortcut ref="ref1" key={'shortcut'} tabLabel={'快捷充值'} {...this.props}/>
        <RechargeTransfer ref="ref2" key={'transfer'} tabLabel={'银行转账'} {...this.props}/>
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='充值'
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
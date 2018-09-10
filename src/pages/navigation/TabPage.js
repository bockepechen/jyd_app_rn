import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  NetInfo,
  Platform,
  DeviceEventEmitter
} from 'react-native';
import HomePage from '../1_home/HomePage';
import LoanPage from '../2_loan/LoanPage';
import DiscoverPage from '../3_discover/DiscoverPage';
import MyPage from '../4_my/MyPage';
import TabNavigator from 'react-native-tab-navigator';
import SplashScreen from 'react-native-splash-screen';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import { scaleSize } from '../../utils/FitViewUtils';
import { ImageStores } from '../../../res/styles/ImageStores';
import DeviceInfo from 'react-native-device-info';
import ModalView from '../../common/ModalView';

export default class TabPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
  }

  componentWillMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      console.log(connectionInfo);
      GlobalStyles.CONNECTION_TYPE = connectionInfo;
      global.NetReqModel.jyd_pubData.network_type = connectionInfo.type;
      global.NetReqModel.jyd_pubData.source_type = '0001';
      global.NetReqModel.jyd_pubData.system_id = `${DeviceInfo.getBrand()} ${Platform.OS} ${DeviceInfo.getSystemVersion()}`;
      DeviceInfo.getIPAddress().then(ip => {
        global.NetReqModel.jyd_pubData.ip = ip;
        console.log(`当前手机IP：${ip}`);
      })
    });
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
    console.log(`系统型号：${DeviceInfo.getSystemVersion()}  手机品牌：${DeviceInfo.getBrand()}`);
  }

  handleFirstConnectivityChange(connectionInfo) {
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    GlobalStyles.CONNECTION_TYPE = connectionInfo;
    global.NetReqModel.jyd_pubData.network_type = connectionInfo.type;
    global.NetReqModel.jyd_pubData.source_type = '0001';
    global.NetReqModel.jyd_pubData.system_id = `${DeviceInfo.getBrand()} ${Platform.OS} ${DeviceInfo.getSystemVersion()}`;
    DeviceInfo.getIPAddress().then(ip => {
      global.NetReqModel.jyd_pubData.ip = ip;
      console.log(`当前手机IP：${ip}`);
    })
  }

  initPubData(){
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    GlobalStyles.CONNECTION_TYPE = connectionInfo;
    global.NetReqModel.jyd_pubData.network_type = connectionInfo.type;
    global.NetReqModel.jyd_pubData.source_type = '0001';
    global.NetReqModel.jyd_pubData.system_id = `${DeviceInfo.getBrand()} ${Platform.OS} ${DeviceInfo.getSystemVersion()}`;
    DeviceInfo.getIPAddress().then(ip => {
      global.NetReqModel.jyd_pubData.ip = ip;
      console.log(`当前手机IP：${ip}`);
    })
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  componentDidMount() {
    // DeviceEventEmitter.addListener('navreset',(dic)=>{
    //     this.setState({
    //       selectedTab: dic.tab,
    //     })
    // });
    DeviceEventEmitter.addListener('callModal', (isShow, modalContentView) => {
      if (isShow) {
        this.refs.modalView.show(modalContentView);
      } else {
        this.refs.modalView.close();
      }
    });
    SplashScreen.hide();
  }

  renderTabNavigator(Component, selectedTab, title, renderIcon, renderSelectedIcon, badgeText) {
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectedTab}
        tabStyle={{ alignItems: 'center', justifyContent: 'flex-start', marginTop:scaleSize(21)}}
        titleStyle={{ fontSize: scaleSize(38), color: '#c3c3c3' }}
        selectedTitleStyle={{ fontSize: scaleSize(38), color: '#ff3a49' }}
        title={title}
        renderIcon={() => <Image style={styles.tabIcon} source={renderIcon} />}
        renderSelectedIcon={() => <Image style={styles.tabIcon} source={renderSelectedIcon} />}
        onPress={() => {
          this.setState({ selectedTab: selectedTab },()=>{
            if(global.NetReqModel.jyd_pubData.token_id == '' && selectedTab =='My'){
              this.props.navigation.navigate('LoginPage')
            }
          });
        }}
        badgeText={badgeText ? badgeText : ''} >
        <Component {...this.props} />
      </TabNavigator.Item>
    )
  }

  render() {
    let safeRootView =
      <SafeAreaViewPlus
        topInset={true}
        bottomInset={true}
        bottomColor='rgba(255,255,255,0.9)'>
        <TabNavigator
          tabBarStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', height: GlobalStyles.BOTTOM_TAB_NAV_HEIGHT}}
          sceneStyle={{ paddingBottom: 0 }}
        >
          {this.renderTabNavigator(HomePage, 'Home', '首页', ImageStores.sy_11, ImageStores.sy_6)}
          {this.renderTabNavigator(LoanPage, 'Loan', '出借', ImageStores.sy_13, ImageStores.sy_9)}
          {this.renderTabNavigator(DiscoverPage, 'Dicover', '发现', ImageStores.sy_12, ImageStores.sy_8)}
          {this.renderTabNavigator(MyPage, 'My', '我的', ImageStores.sy_10, ImageStores.sy_7)}
        </TabNavigator>
        <ModalView ref='modalView'/>
      </SafeAreaViewPlus>

    return safeRootView;
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    width: scaleSize(102),
    height: scaleSize(90)
  },
});
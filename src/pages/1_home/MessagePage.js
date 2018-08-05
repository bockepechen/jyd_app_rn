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
import TabOfficialPost from './TabOfficialPost';
import TabStationMessage from './TabStationMessage';
import ViewUtils from '../../utils/ViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';

let isAndroid = Platform.OS==='android'?true:false;
export default class MessagePage extends PureComponent {
  constructor(props) {
    super(props);
    this.scrollableTabTitle = ['官方公告','站内信']
    this.state = {
        isLoading : false,
        tabKey : '.$officialPost',
    }
  }

  componentDidMount() {
    if(isAndroid)
      BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    if(isAndroid)
      BackHandler.removeEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }

  componentWillMount() {
  }

  onBackButtonPressAndroid = () => {
      if(this.state.tabKey == '.$officialPost'){
        this.refs.ref1.readMsg()
      }else{
        this.refs.ref2.readMsg()
      }
      this.props.navigation.goBack();
     return true; 
 }

  navGoback = () => {
    if(this.state.tabKey == '.$officialPost'){
      this.refs.ref1.readMsg()
    }else{
      this.refs.ref2.readMsg()
    }
    this.props.navigation.goBack();
  }

  //一键读取
  getRightButton(callBack) {
    return <TouchableOpacity
              style={{marginRight:scaleSize(54),}}
              onPress={callBack}>
              <View style={{flexDirection:'row'}}>
                <Text
                    style={{color:'#fff',fontSize:scaleSize(49)}} 
                >一键读取
                </Text>
                <Image 
                    source={ImageStores.qt_1}
                    resizeMode={'stretch'}
                    style={isAndroid ? {width:scaleSize(46), height:scaleSize(46),marginTop:scaleSize(12)} : {width:scaleSize(46), height:scaleSize(46),marginTop:scaleSize(2)}} />
              </View>
          </TouchableOpacity>
  }

  myOnChangeTab(obj){
    this.setState({
        tabKey : obj.ref.key
    })
  }

  _readAll() {
    if(this.state.tabKey == '.$officialPost'){
      this.refs.ref1.readAll()
    }else{
      this.refs.ref2.readAll()
    }
  }

  renderScrollableTabView() {
    return (
      <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        onChangeTab={(obj)=>this.myOnChangeTab(obj)}
        tabBarBackgroundColor='#F0F0F0'
        tabBarInactiveTextColor='#656565'
        tabBarActiveTextColor='#c7b299'
        tabBarTextStyle={{fontSize:scaleSize(42)}}
        tabBarUnderlineStyle={{
          backgroundColor:'#c7b299',
          height:scaleSize(2),
        }}>

        <TabOfficialPost ref="ref1" key={'officialPost'} tabLabel={'官方公告'} {...this.props}/>
        <TabStationMessage ref="ref2" key={'stationMessage'} tabLabel={'站内信'} {...this.props}/>
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='消息中心'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
          rightButton={this.getRightButton(()=>this._readAll())}
        />
        {this.renderScrollableTabView()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  
})
import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  ImageBackground,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TabSubCyz from './TabSubCyz'
import TabSubTbz from './TabSubTbz'
import TabSubZrz from './TabSubZrz'
import TabSubYjs from './TabSubYjs'
import {ImageStores} from '../../../res/styles/ImageStores';
import LoadingIcon from '../../common/LoadingIcon';
import Utils from '../../utils/Utils';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabSbjq extends Component {
  constructor(props){
    super(props);
    this.scrollableTabTitle = ['持有中','投标中','转让中','已结束']
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      isLoading:false,
      waitRepay:'',
      waitContractAmount:'',
      arrivalRepay:'',
    }
  }

  componentDidMount() {
    this.getInfoData()
  }

  async getInfoData() {
    this.setState({
      isLoading:true
    });
    global.NetReqModel.tel_phone = await "15822753827";
    global.NetReqModel.jyd_pubData.user_id = await "91";
    global.NetReqModel.jyd_pubData.source_type = await "0001";
    global.NetReqModel.jyd_pubData.system_id = await "Android 7";
    global.NetReqModel.jyd_pubData.network_type = await "wifi";
    global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
    let url = await '/lendCenter/calculateStandardpowder';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        this.setState({
          waitRepay:parseFloat(result.waitRepay).toFixed(2),
          waitContractAmount:parseFloat(result.waitContractAmount).toFixed(2),
          arrivalRepay:parseFloat(result.arrivalRepay).toFixed(2)
        })
      }
      // 返回数据，关闭Loading动画
      this.setState(
        {
          isLoading:false,
        }
        , () => {
      })
    })
    .catch((e) => {
      console.log(e);
      // TODO Toast提示异常
      // 关闭Loading动画
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
    })
  }

  renderFirst(){
    return (
      <ImageBackground 
        source={ImageStores.cp_5_1}
        resizeMode={'stretch'}
        style={{flexDirection:'column',alignItems:'center',width:scaleSize(1242), height:scaleSize(666),marginTop:scaleSize(48)}}
      >
        <View style={{marginTop:scaleSize(132),alignItems:'center'}}>
          <Text style={{fontSize:scaleSize(36),color:'#c7b299'}}>{'待收本金(元)'}</Text>
          <Text style={{marginTop:scaleSize(45),height:scaleSize(90), fontSize:scaleSize(90),color:'#998675'}}>{Utils.formatMoney(this.state.waitContractAmount,2)}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop: isAndroid ? scaleSize(155) : scaleSize(174)}}>
          <View style={{alignItems:'center'}}>
            <Text style={{fontSize:scaleSize(36),color:'#989898'}}>{'待收回报(元)'}</Text>
            <Text style={{fontSize:scaleSize(58),color:'#998675',marginTop:scaleSize(12)}}>{Utils.formatMoney(this.state.waitRepay,2)}</Text>
          </View>
          <View style={{alignItems:'center',marginLeft:scaleSize(250)}}>
            <Text style={{fontSize:scaleSize(36),color:'#989898'}}>{'累计已收回报(元)'}</Text>
            <Text style={{fontSize:scaleSize(58),color:'#998675',marginTop:scaleSize(12)}}>{Utils.formatMoney(this.state.arrivalRepay,2)}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  renderScrollableTabView() {
    return (
      <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
        tabBarBackgroundColor='#F0F0F0'
        tabBarInactiveTextColor='#656565'
        tabBarActiveTextColor='#c7b299'
        tabBarTextStyle={{fontSize:scaleSize(42)}}
        style={{marginTop:scaleSize(48)}}
        tabBarUnderlineStyle={{
          backgroundColor:'#c7b299',
          height:scaleSize(2),
        }}>

        <TabSubCyz key={'cyz'} tabLabel={'持有中'} navigationParam={this.props.navigation}/>
        <TabSubTbz key={'tbz'} tabLabel={'投标中'} navigationParam={this.props.navigation}/>
        <TabSubZrz key={'zrz'} tabLabel={'转让中'} navigationParam={this.props.navigation}/>
        <TabSubYjs key={'yjs'} tabLabel={'已结束'} navigationParam={this.props.navigation}/>
      </ScrollableTabView>
    )
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
        {this.renderFirst()}        
        {this.renderScrollableTabView()}
        {this.state.isLoading?(<LoadingIcon />):null}
      </View>
    )
  }

  render() {
    return (
      this.renderMainView()
    )
  }
}
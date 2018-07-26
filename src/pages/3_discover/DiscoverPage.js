import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';


export default class DiscoverPage extends Component {
  constructor(props) {
    super(props);
  }

  renderSwiper() {
    let swiperViews = [];
    let swiperSourceData = [
      ImageStores.fx_2,
      ImageStores.fx_2,
      ImageStores.fx_2,
      ImageStores.fx_2,
      ImageStores.fx_2,
    ];
    swiperSourceData.map((item, index) => {
      swiperViews.push(
        <TouchableHighlight 
          key={index}
          underlayColor='rgba(0,0,0,0)' 
          onPress={()=>{console.log(`press me ${index}`)}}>
          <Image 
            source={item} 
            resizeMode={'stretch'} 
            style={{
              width:GlobalStyles.WINDOW_WIDTH,
              height:scaleSize(612)
            }} />
        </TouchableHighlight>
      )
    })
    return (
      <View style={{position:'absolute', top:0, height:scaleSize(612), width:GlobalStyles.WINDOW_WIDTH}}>
        <Swiper
          horizontal={true}
          activeDotColor='#998675'
          dotColor='#b3b3b3'
          paginationStyle={{bottom:scaleSize(8)}}>
          {swiperViews}
        </Swiper>
      </View>
    )
  }

  renderActivityView() {
    return (
      <View style={{marginTop:scaleSize(84), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(150), flexDirection:'row'}}>
        <Image
          source={ImageStores.sy_3}
          resizeMode={'stretch'}
          style={{marginLeft:scaleSize(102), width:scaleSize(150), height:scaleSize(150)}}/>
        <View style={{marginLeft:scaleSize(42), width:scaleSize(333), height:scaleSize(150)}}>
          <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'邀请好友'}</Text>
          <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#656565'}}>{'点击邀请好友赚佣金'}</Text>
        </View>
        <Image
          source={ImageStores.sy_4}
          resizeMode={'stretch'}
          style={{marginLeft:scaleSize(36), width:scaleSize(150), height:scaleSize(150)}}/>
        <View style={{marginLeft:scaleSize(42), marginRight:scaleSize(112), height:scaleSize(150)}}>
          <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'现金红包'}</Text>
          <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#656565'}}>{'参与活动 获取红包'}</Text>
        </View>
      </View>
    )
  }

  renderBonusView() {
    return (
      <View style={{marginTop:scaleSize(39), alignItems:'center', justifyContent:'center'}}>
        <ImageBackground
          source={ImageStores.fx_3}
          resizeMode={'stretch'}
          style={{width:scaleSize(837), height:scaleSize(297)}}>
          <View style={{marginLeft:scaleSize(231), marginTop:scaleSize(96), height:scaleSize(28)}}>
            <Text style={{fontSize:scaleSize(28), color:'#fcee21'}}>{'累计获得'}</Text>
          </View>
          <View style={{marginLeft:scaleSize(186), marginTop:scaleSize(21), height:scaleSize(69), flexDirection:'row', alignItems:'flex-end'}}>
            <Text style={{fontSize:scaleSize(40), color:'#ffffff'}}>{'￥'}</Text>
            <Text style={{fontSize:scaleSize(69), color:'#ffffff'}}>{'1000000'}</Text>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderGridView() {
    let line1_views = [];
    let line2_views = [];
    let line1_data = [
      {
        img: ImageStores.sy_22,
        title: '活动专区',
        callback: () => {console.log('活动专区')}
      },
      {
        img: ImageStores.sy_23,
        title: '优选商城',
        callback: null
      },
      {
        img: ImageStores.sy_24,
        title: '运营报告',
        callback: null
      },
    ];
    let line2_data = [
      {
        img: ImageStores.sy_22,
        title: '企业资质',
        callback: null
      },
      {
        img: ImageStores.sy_23,
        title: '帮助中心',
        callback: null
      },
      {
        img: ImageStores.sy_24,
        title: '官方账号',
        callback: null
      },
    ];

    line1_data.map((item, index) => {
      line1_views.push(
        <TouchableOpacity key={index} style={{alignItems:'center'}} onPress={item.callback}>
          <Image source={item.img} resizeMode={'stretch'} style={{width:scaleSize(138), height:scaleSize(138)}}/>
          <Text style={{marginTop:scaleSize(24), fontSize:scaleSize(36), color:'#656565'}}>{item.title}</Text>
        </TouchableOpacity>
      )
    })
    line2_data.map((item, index) => {
      line2_views.push(
        <TouchableOpacity key={index} style={{alignItems:'center'}}>
          <Image source={item.img} resizeMode={'stretch'} style={{width:scaleSize(138), height:scaleSize(138)}}/>
          <Text style={{marginTop:scaleSize(24), fontSize:scaleSize(36), color:'#656565'}}>{item.title}</Text>
        </TouchableOpacity>
      )
    })

    return (
      <View>
        <View style={{marginTop:scaleSize(78), alignItems:'center', justifyContent:'center'}}>
          <View style={{width:scaleSize(837), flexDirection:'row', justifyContent:'space-between'}}>
            {line1_views}
          </View>
        </View>
        <View style={{marginTop:scaleSize(57), alignItems:'center', justifyContent:'center'}}>
          <View style={{width:scaleSize(837), flexDirection:'row', justifyContent:'space-between'}}>
            {line2_views}
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='发现'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'/>
        <View style={{height:scaleSize(612)}}>
          <Image
            source={ImageStores.dl_6}
            resizeMode={'stretch'}
            style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(435)}}/>
          {this.renderSwiper()}
        </View>
        {this.renderActivityView()}
        {this.renderBonusView()}
        {this.renderGridView()}
      </View>
    );
  }
}

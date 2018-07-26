import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  TouchableHighlight
} from 'react-native';
import AppStatusBar from '../../common/AppStatusBar';
import Swiper from 'react-native-swiper';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import HorizantalFlatlistCell from './HorizantalFlatlistCell';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import ProductCardMain from '../2_loan/ProductCardMain';
import ProductCardSub from '../2_loan/ProductCardSub';

const msgArray = [
  {msgTxt: '1. 你好放假放到卡拉斯京分开了的撒'},
  {msgTxt: '2. 次哦啊囧超级三哦参加哦i撒从啊手机哦参加哦撒手机啊黄i是'},
  {msgTxt: '3. 时空怕靠谱纯牛奶扫你才骚就从萨科皮卡车怕时间'},
  {msgTxt: '4. 岁啊还吃呢少见哦贾长松i接啊词接送i就从撒'},
]
let isAndroid = Platform.OS==='android'?true:false;
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(props);
    this.state = {
      sourceData: ['银行存管','风险控制','合作机构','关于我们'],
      selected: new Map(),
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  keyExtractor = (data, index) => {return String(index);}

  renderFlatListItem = (data) => {
    return (
      <HorizantalFlatlistCell
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(data.index)}
        {...this.props} />
    )
  }

  _onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    });
    let navData = {
      title:'详情页面'
    };
    this.props.navigation.navigate('LoanPageDetails',{
      data:navData,
      ...this.props
    })
  };

  onPressProduct = () => {
    let navData = {
      title:'详情页面'
    };
    this.props.navigation.navigate('LoanPageDetails',{
      data:navData,
      ...this.props
    })
  }

  renderSwiper() {
    let swiperViews = [];
    let swiperSourceData = [ImageStores.sy_1,ImageStores.sy_1,ImageStores.sy_1,ImageStores.sy_1];
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
              height:scaleSize(690)
            }} />
        </TouchableHighlight>
      )
    })
    return (
      <Swiper
        horizontal={true}
        activeDotColor='#998675'
        dotColor='#b3b3b3'
        paginationStyle={{bottom:scaleSize(8)}}>
        {swiperViews}
      </Swiper>
    )
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderForeground = () => (
      this.renderSwiper()
    );
    config.renderBackground = () => (
      <Image 
        source={ImageStores.sy_21} 
        resizeMode={'stretch'} 
        style={{
          width:GlobalStyles.WINDOW_WIDTH,
          height:scaleSize(690)
        }}/>
    );
    config.renderStickyHeader = () => (
      <View style={{
        flexDirection:'row',
        justifyContent: 'space-evenly',
        alignItems:'center',
        height:scaleSize(150),
        backgroundColor:'#e7142d',
        paddingLeft:scaleSize(60),
        paddingRight:scaleSize(60),
      }}>
        <TouchableHighlight 
          underlayColor='rgba(0,0,0,0)'
          style={{flex:1,flexDirection:'row', justifyContent:'flex-start'}}>
          <Image 
            source={ImageStores.bar2}
            resizeMode={'stretch'}
            style={{width:scaleSize(75), height:scaleSize(75)}} />
        </TouchableHighlight>
        <Text style={{fontSize:scaleSize(56), color:'#ffffff'}}>{'嘉e贷'}</Text>
        <TouchableHighlight 
          underlayColor='rgba(0,0,0,0)'
          style={{flex:1, flexDirection:'row', justifyContent:'flex-end'}}>
          <Image 
            source={ImageStores.bar1}
            resizeMode={'stretch'}
            style={{width:scaleSize(75), height:scaleSize(75)}} />
        </TouchableHighlight>
      </View>
    );
    // config.renderFixedHeader = () => (
    //   <View style={{
    //     position:'absolute',
    //     top:0,
    //     bottom:0,
    //     left:scaleSize(60),
    //     right:scaleSize(60),
    //     backgroundColor:'rgba(0,0,0,0)',
    //     flexDirection:'row',
    //     alignItems:'center',
    //     justifyContent:'space-between',
    //   }}>
    //     <TouchableHighlight underlayColor='rgba(0,0,0,0)'>
    //       <Image 
    //         source={ImageStores.bar2}
    //         resizeMode={'stretch'}
    //         style={{width:scaleSize(75), height:scaleSize(75)}} />
    //     </TouchableHighlight>
    //     <TouchableHighlight underlayColor='rgba(0,0,0,0)'>
    //       <Image 
    //         source={ImageStores.bar1}
    //         resizeMode={'stretch'}
    //         style={{width:scaleSize(75), height:scaleSize(75)}} />
    //     </TouchableHighlight>
    //   </View>
    // );
    return config;
  }

  renderParallaxView(params, contentView) {
    let parallaxConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        showsVerticalScrollIndicator={false}
        backgroundColor='#E8152E'
        contentBackgroundColor="#F0F0F0"
        parallaxHeaderHeight={scaleSize(690)}
        stickyHeaderHeight={scaleSize(150)}
        {...parallaxConfig}
        >
        {contentView}
      </ParallaxScrollView>
    )
  }

  renderTopNavIconViews() {
    let topNavIconViews = [];
    let IconDatas = [
      {
        iconImg:ImageStores.sy_22,
        iconName:'每日签到'
      },
      {
        iconImg:ImageStores.sy_23,
        iconName:'邀请好友'
      },
      {
        iconImg:ImageStores.sy_24,
        iconName:'我的奖励'
      },
      {
        iconImg:ImageStores.sy_25,
        iconName:'消息中心'
      },
    ];
    IconDatas.map((item, index) => {
      topNavIconViews.push(
        <TouchableOpacity 
          key={index} 
          style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <Image 
            source={item.iconImg} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(114), height:scaleSize(114)}}/>
          <Text style={{marginTop:scaleSize(27), color:'#656565', fontSize:scaleSize(32)}}>
            {item.iconName}
          </Text>
        </TouchableOpacity>
      )
    });
    return (
      <View style={{
        marginTop:scaleSize(60),
        marginLeft:scaleSize(132),
        marginRight:scaleSize(132),
        flexDirection:'row',
        justifyContent:'space-between',
      }}>
      {topNavIconViews}
      </View>
    )
  }

  renderSubTitleLine(subTitle, topDistance) {
    return (
      <View style={{marginTop:scaleSize(topDistance), flexDirection:'row', alignItems:'center', marginLeft:scaleSize(54), marginRight:scaleSize(54)}}>
        <ImageBackground 
          source={ImageStores.sy_14} 
          resizeMode={'stretch'} 
          style={{marginLeft:0, width:scaleSize(258), height:scaleSize(72), justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'#f2f2f2', fontSize:scaleSize(32)}}>{subTitle}</Text>
        </ImageBackground>
        <View style={{flex:1,backgroundColor:'#c7b299', marginLeft:scaleSize(6), width:scaleSize(870),height:0.5}}/>
      </View>
    )
  }

  renderFlatListView() {
    return (
      <FlatList
        style={{marginTop:scaleSize(72), marginLeft:scaleSize(42)}}
        data={this.state.sourceData}
        extraData={this.state.selected}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderFlatListItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false} />
    )
  }

  renderScrollView() {
    return (
      <View>
        {/*<Marquee
          data={msgArray}
          fontSize={11}
          height={20}
          duration={1000}
        delay={3000} />*/}
        {this.renderTopNavIconViews()}
        {this.renderSubTitleLine('首页推荐', 72)}
        <ProductCardMain isRestMoney={false} ifSell={true} top={scaleSize(24)} data={''}/>
        <ProductCardSub isRestMoney={true} ifSell={true} top={0} bottom={0} data={''}/>

        <View style={{marginTop:scaleSize(32), alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:scaleSize(36), color:'#3b92f0'}}>{'*市场有风险, 投资需谨慎'}</Text>
        </View>

        <View style={{marginTop:scaleSize(69), alignItems:'center', justifyContent:'center'}}>
          <Image 
            source={ImageStores.sy_2} 
            resizeMode={'stretch'} 
            style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(510)}}/>
        </View>

        {this.renderSubTitleLine('关于我们', 42)}

        <View style={{marginTop:scaleSize(84), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(150), flexDirection:'row'}}>
          <Image
            source={ImageStores.sy_3}
            resizeMode={'stretch'}
            style={{marginLeft:scaleSize(132), width:scaleSize(150), height:scaleSize(150)}}/>
          <View style={{marginLeft:scaleSize(42), width:scaleSize(324), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'30,078万'}</Text>
            <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#998675'}}>{'累计交易金额'}</Text>
          </View>
          <Image
            source={ImageStores.sy_4}
            resizeMode={'stretch'}
            style={{marginLeft:scaleSize(36), width:scaleSize(150), height:scaleSize(150)}}/>
          <View style={{marginLeft:scaleSize(42), marginRight:scaleSize(112), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'995天'}</Text>
            <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#998675'}}>{'安全运营'}</Text>
          </View>
        </View>

        {this.renderFlatListView()}
        
        <View style={{marginTop:scaleSize(42), marginBottom:isAndroid?scaleSize(150):scaleSize(84), alignItems:'center'}}>
          <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:'#998675'}}>{'© 2018 天津嘉业投资管理有限公司'}</Text>
        </View>

        <View style={{height:GlobalStyles.BOTTOM_TAB_NAV_HEIGHT}}/>
      </View>
    )
  }

  render() {
    let StatusBarView = 
      <AppStatusBar 
          barColor='#E8152E'
          barStyle='light-content'/>
    return (
      <View style={GlobalStyles.rootContainer}>
        {StatusBarView}
        {this.renderParallaxView({}, this.renderScrollView())}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  parallax_fixHeader: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left:0,
    top:0,
    flexDirection:'row',
    alignItems:'center',
    paddingTop:GlobalStyles.STATUSBAR_HEIGHT,
    paddingRight:4,
    paddingLeft:4,
    justifyContent:'space-between',
  },
  parallax_stickyHeader: {
    justifyContent: 'center',
    alignItems:'center',
    height:scaleSize(150),
    backgroundColor:'#e7142d',
  },
})
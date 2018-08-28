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
  TouchableHighlight,
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
import LoadingIcon from '../../common/LoadingIcon';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';

let isAndroid = Platform.OS==='android'?true:false;
let refreshRate = 60;
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(props);
    global.NetReqModel.tel_phone =  "15822753827";
    global.NetReqModel.jyd_pubData.user_id =  "91";
    global.NetReqModel.jyd_pubData.token_id =  "123235h5e3111";
    this.state = {
      // sourceData: ['银行存管','风险控制','安全保障','合作机构','关于我们'],
      sourceData: [
        {
          title:'银行存管',
          img:ImageStores.sy_26
        },
        {
          title:'风险控制',
          img:ImageStores.sy_27
        },
        {
          title:'安全保障',
          img:ImageStores.sy_28
        },
        {
          title:'合作机构',
          img:ImageStores.sy_29
        },
        {
          title:'关于我们',
          img:ImageStores.sy_30
        },
      ],
      selected: new Map(),
      isLoading: false,
      httpRes:global.InitNetData.httpRes,
      detail_url:global.InitNetData.httpRes && global.InitNetData.httpRes.detail_url ? global.InitNetData.httpRes.detail_url : '',
      sell_url:global.InitNetData.httpRes && global.InitNetData.httpRes.sell_url ? global.InitNetData.httpRes.sell_url : '',
      aboutUs_url:global.InitNetData.httpRes && global.InitNetData.httpRes.aboutUs_url ? global.InitNetData.httpRes.aboutUs_url :'',
      bank_url:global.InitNetData.httpRes && global.InitNetData.httpRes.bank_url ? global.InitNetData.httpRes.bank_url : '',
      cooperationOrg_url:global.InitNetData.httpRes && global.InitNetData.httpRes.cooperationOrg_url ? global.InitNetData.httpRes.cooperationOrg_url : '',
      risk_url:global.InitNetData.httpRes && global.InitNetData.httpRes.risk_url ? global.InitNetData.httpRes.risk_url : '',
      safety_url:global.InitNetData.httpRes && global.InitNetData.httpRes.safety_url ? global.InitNetData.httpRes.safety_url : '',
      sign_url:global.InitNetData.httpRes && global.InitNetData.httpRes.sign_url ? global.InitNetData.httpRes.sign_url : '',
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    // this.getInfoData()
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  async getInfoData() {
    let url = await '/firstPage';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      for(var i = 0 ; i < result.appsellinfos.length ; i++){
        result.appsellinfos[i].expectedyearyield = Utils.fmoney(result.appsellinfos[i].expectedyearyield*100,2)
        result.appsellinfos[i].expectedyield = Utils.fmoney(result.appsellinfos[i].expectedyield*100,2)
      }
      global.InitNetData = {
          httpRes : result,
      }
      this.setState({
        isLoading:false,
        detail_url:global.InitNetData.httpRes && global.InitNetData.httpRes.detail_url ? global.InitNetData.httpRes.detail_url : '',
        sell_url:global.InitNetData.httpRes && global.InitNetData.httpRes.sell_url ? global.InitNetData.httpRes.sell_url : '',
        aboutUs_url:global.InitNetData.httpRes && global.InitNetData.httpRes.aboutUs_url ? global.InitNetData.httpRes.aboutUs_url :'',
        bank_url:global.InitNetData.httpRes && global.InitNetData.httpRes.bank_url ? global.InitNetData.httpRes.bank_url : '',
        cooperationOrg_url:global.InitNetData.httpRes && global.InitNetData.httpRes.cooperationOrg_url ? global.InitNetData.httpRes.cooperationOrg_url : '',
        risk_url:global.InitNetData.httpRes && global.InitNetData.httpRes.risk_url ? global.InitNetData.httpRes.risk_url : '',
        safety_url:global.InitNetData.httpRes && global.InitNetData.httpRes.safety_url ? global.InitNetData.httpRes.safety_url : '',
        sign_url:global.InitNetData.httpRes && global.InitNetData.httpRes.sign_url ? global.InitNetData.httpRes.sign_url : '',
      })
    })
    .catch((e) => {
      console.log(e);
    })
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

  _onPress = (id,item,type) => {
    if(type == 'item')
    {
      global.NetReqModel.sellInfoId = item.sellinfoid;
      this.props.navigation.navigate('JeyxListItemDetail',{
        data:{
          url:'/productDetails/querySellinDetail',
          title:'嘉e精选',
          jsonObj:global.NetReqModel
        },
        ...this.props
      });
    }else{
      global.NetReqModel.sell_id = item.sellinfoid;
      this.props.navigation.navigate('JeyxListItemDetail',{
        data:{
          url:'/personProLend',
          title:'嘉e精选',
          jsonObj:global.NetReqModel
        },
        ...this.props
      });
    }
    
  };

  _onPressItem = (index,item) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(index, !selected.get(index));
      return {selected};
    });
    let tempurl = ''
    if(index == 0){
      tempurl = this.state.bank_url
    }
    else if(index == 1){
      tempurl = this.state.risk_url
    }
    else if(index == 2){
      tempurl = this.state.safety_url
    }
    else if(index == 3){
      tempurl = this.state.cooperationOrg_url
    }
    else if(index == 4){
      tempurl = this.state.aboutUs_url
    }
    let navData = {
      title:item.title,
      url:tempurl
    };
    this.props.navigation.navigate('HomeItemDetail',{
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
    let swiperSourceData = this.state.httpRes && this.state.httpRes.AppMainHeadBanners ? [] : [ImageStores.F3];
    if(this.state.httpRes && this.state.httpRes.AppMainHeadBanners){
        for(var i = 0 ; i < this.state.httpRes.AppMainHeadBanners.length ; i++){
          swiperSourceData[i] = this.state.httpRes.AppMainHeadBanners[i].ImgPath
        }
    }
    swiperSourceData.map((item, index) => {
      swiperViews.push(
        <TouchableHighlight 
          key={index}
          underlayColor='rgba(0,0,0,0)' 
          onPress={()=>{
            if(!this.state.httpRes && !this.state.httpRes.AppMainHeadBanners)
             return false
            this.props.navigation.navigate('HomeItemDetail',{
              data:{
                url:this.state.httpRes.AppMainHeadBanners[index].Url,
                title:this.state.httpRes.AppMainHeadBanners[index].Title,
              }
            })}
          }
          >
          <Image
            source={this.state.httpRes && this.state.httpRes.AppMainHeadBanners ? {uri : this.state.httpRes.AppMainHeadBanners[index].ImgPath} : item} 
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
          onPress={()=>this.goto('SettingPage')}
          underlayColor='rgba(0,0,0,0)'
          style={{flex:1, flexDirection:'row', justifyContent:'flex-end'}}>
          <Image 
            source={ImageStores.bar1}
            resizeMode={'stretch'}
            style={{width:scaleSize(75), height:scaleSize(75)}} />
        </TouchableHighlight>
      </View>
    );
    return config;
  }
  renderParallaxView(params, contentView) {
    let parallaxConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        ref="pullToRefresh"
        onScroll = {
          (e) => {
            if(!this.state.isLoading && e.nativeEvent.contentOffset.y+refreshRate < 0){
              this.setState({isLoading:true},()=>{
                this.getInfoData();
              })
            }
          }
        }
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

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  renderTopNavIconViews() {
    let topNavIconViews = [];
    let IconDatas = [
      {
        iconImg:ImageStores.sy_22,
        iconName:'每日签到',
        callback:() => {this.goto('SignInPage',{
          url:'/checkIn',
          jsonObj:global.NetReqModel,
          title:'每日签到'
        })}
      },
      {
        iconImg:ImageStores.sy_23,
        iconName:'邀请好友',
        callback:() => {this.goto('InvitingFriendsPage')}
      },
      {
        iconImg:ImageStores.sy_24,
        iconName:'我的奖励',
        callback:() => {this.goto('RedPacketPage')}
      },
      {
        iconImg:ImageStores.sy_25,
        iconName:'消息中心',
        callback:() => {this.goto('MessagePage')}
      },
    ];
    IconDatas.map((item, index) => {
      topNavIconViews.push(
        <TouchableOpacity 
          onPress={item.callback} 
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
        <ProductCardMain onPress={this._onPress} top={scaleSize(24)} data={this.state.httpRes && this.state.httpRes.appsellinfos ? this.state.httpRes.appsellinfos[0] : ''}/>
        <ProductCardSub  onPress={this._onPress} top={0} bottom={0} data={this.state.httpRes && this.state.httpRes.appsellinfos ? this.state.httpRes.appsellinfos[1] : ''}/>

        <View style={{marginTop:scaleSize(32), alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:scaleSize(36), color:'#3b92f0'}}>{'*市场有风险, 投资需谨慎'}</Text>
        </View>

        <View style={{marginTop:scaleSize(69), alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity
            onPress={()=>{
              if(!this.state.httpRes.AppSubHeadBanners)
                return false
              this.props.navigation.navigate('HomeItemDetail',{
                  data:{
                    url:this.state.httpRes.AppSubHeadBanners[0].Url,
                    title:this.state.httpRes.AppSubHeadBanners[0].Title,
                  }
                })
            }}
          >
            <Image 
              source={this.state.httpRes && this.state.httpRes.AppSubHeadBanners && this.state.httpRes.AppSubHeadBanners.length > 0 ? {uri : this.state.httpRes.AppSubHeadBanners[0].ImgPath} : ImageStores.sy_2} 
              resizeMode={'stretch'} 
              style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(510)}}/>
          </TouchableOpacity>
        </View>

        {this.renderSubTitleLine('关于我们', 42)}

        <View style={{marginTop:scaleSize(84), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(150), flexDirection:'row'}}>
          <Image
            source={ImageStores.sy_3}
            resizeMode={'stretch'}
            style={{marginLeft:scaleSize(132), width:scaleSize(150), height:scaleSize(150)}}/>
          <View style={{marginLeft:scaleSize(42), width:scaleSize(324), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{this.state.httpRes && this.state.httpRes.AccumulativeAmount ? Utils.fmoney(this.state.httpRes.AccumulativeAmount) : '30,078'}万</Text>
            <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#998675'}}>{'累计交易金额'}</Text>
          </View>
          <Image
            source={ImageStores.sy_4}
            resizeMode={'stretch'}
            style={{marginLeft:scaleSize(36), width:scaleSize(150), height:scaleSize(150)}}/>
          <View style={{marginLeft:scaleSize(42), marginRight:scaleSize(112), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{this.state.httpRes && this.state.httpRes.AccumulativeDays ? this.state.httpRes.AccumulativeDays : '990'}天</Text>
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
        {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
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
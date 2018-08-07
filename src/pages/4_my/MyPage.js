import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {ImageStores} from '../../../res/styles/ImageStores';
import AppStatusBar from '../../common/AppStatusBar';

export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
      isEye: true,
      image_eye: ImageStores.me_3,
    }
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{

    });
  }

  loadData = () => {
    this.setState({isRefresh:true});
    setTimeout(() => {
      // simulate data request
      this.setState({isRefresh:false});
    }, 2000);
  }

  hideNum = () => {
    this.setState({
      isEye: !this.state.isEye, 
    }, () => {
      this.setState({
        image_eye:this.state.isEye?ImageStores.me_3:ImageStores.me_2
      })
    });
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderForeground = () => (
      <View style={{marginTop:scaleSize(228)}}>
      <View style={{marginLeft:scaleSize(81), marginRight:scaleSize(81), height:scaleSize(210), flexDirection:'row', justifyContent:'space-evenly'}}>
        <View style={{flex:1, flexDirection:'column', alignItems:'center'}}>
          <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(48), color:'#ffffff'}}>{'总资产(元)'}</Text>
          <Text style={{marginTop:scaleSize(54), fontSize:scaleSize(60), fontWeight:'bold', color:'#ffffff'}}>{this.state.isEye?'88888888.00':'******'}</Text>
        </View>
        <View style={{backgroundColor:'white', width:1, height:scaleSize(210)}}/>
        <View style={{flex:1, flexDirection:'column', alignItems:'center'}}>
          <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(48), color:'#ffffff'}}>{'累计回报(元)'}</Text>
          <Text style={{marginTop:scaleSize(54), fontSize:scaleSize(60), fontWeight:'bold', color:'#ffffff'}}>{this.state.isEye?'88888888.00':'******'}</Text>
        </View>
      </View>
      <ImageBackground 
        source={ImageStores.me_9}
        resizeMode={'stretch'}
        style={{marginTop:scaleSize(90), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(309), flexDirection:'row'}}>
        <View style={{marginLeft:scaleSize(108), marginTop:scaleSize(36), width:scaleSize(555), height:scaleSize(159)}}>
          <View style={{flexDirection:'row', alignItems:'flex-end'}}>
            <Text style={{fontSize:scaleSize(36), color:'#656565'}}>{'账户余额(元):'}</Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={this.hideNum} >
              <Image source={this.state.image_eye} resizeMode={'stretch'} style={{marginLeft:scaleSize(36), width:scaleSize(69), height:scaleSize(54)}}/>
            </TouchableHighlight>
          </View>
          <Text style={{marginTop:scaleSize(39), width:scaleSize(555), fontSize:scaleSize(66), fontWeight:'200', color:'#ff3a49'}}>{this.state.isEye?'88888888.00':'******'}</Text>
        </View>
        <View style={{marginTop:scaleSize(81), marginLeft:scaleSize(21), height:scaleSize(84), flexDirection:'row'}}>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'>
            <ImageBackground source={ImageStores.me_5} resizeMode={'stretch'} style={{width:scaleSize(216), height:scaleSize(84), alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:scaleSize(48), fontWeight:'200', color:'#ffffff'}}>{'充值'}</Text>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'>
            <ImageBackground source={ImageStores.me_11} resizeMode={'stretch'} style={{marginLeft:scaleSize(27), width:scaleSize(216), height:scaleSize(84), alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:scaleSize(48), fontWeight:'200', color:'#ff3a49'}}>{'提现'}</Text>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      </ImageBackground>
      </View>
    );
    config.renderBackground = () => (
      <Image 
        source={ImageStores.me_1} 
        resizeMode={'stretch'} 
        style={{
          width:GlobalStyles.WINDOW_WIDTH,
          height:scaleSize(837)
        }}/>
    );
    config.renderStickyHeader = () => (
      <View style={styles.parallax_stickyHeader}>
        <Text style={{fontSize:18, color:'white'}}>{''}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View style={{
        position:'absolute',
        top:0,
        bottom:0,
        left:scaleSize(78),
        right:scaleSize(60),
        backgroundColor:'rgba(0,0,0,0)',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
      }}>
        <TouchableHighlight underlayColor='rgba(0,0,0,0)'>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image 
              source={ImageStores.me_10} 
              resizeMode={'stretch'} 
              style={{width:scaleSize(96), height:scaleSize(96)}}/>
            <Text style={{marginLeft:scaleSize(39), fontSize:scaleSize(48), color:'#ffffff'}}>{'用户13752768957'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>this.goto('SettingPage')} underlayColor='rgba(0,0,0,0)'>
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
        showsVerticalScrollIndicator={false}
        backgroundColor='#E8152E'
        contentBackgroundColor="#F0F0F0"
        parallaxHeaderHeight={scaleSize(837)}
        stickyHeaderHeight={scaleSize(150)}
        {...parallaxConfig}
        >
        {contentView}
      </ParallaxScrollView>
    )
  }

  renderGridView() {
    return (
      <View style={{marginTop:scaleSize(6)}}>
        <ImageBackground source={ImageStores.me_4} resizeMode={'stretch'} style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(516)}}>
          <View style={{flex:1, borderWidth:0, flexDirection:'column', justifyContent:'space-evenly'}}>
            <View style={{flex:1, borderWidth:0, flexDirection:'row', justifyContent:'space-evenly'}}>
              <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                <Image 
                  source={ImageStores.sy_3}
                  resizeMode={'stretch'}
                  style={{marginLeft:scaleSize(105), marginTop:scaleSize(66), width:scaleSize(150), height:scaleSize(150)}}/>
                <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(114), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                  {'资产详情'}
                </Text>
              </View>
              <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                <Image 
                  source={ImageStores.sy_3}
                  resizeMode={'stretch'}
                  style={{marginLeft:scaleSize(48), marginTop:scaleSize(66), width:scaleSize(150), height:scaleSize(150)}}/>
                <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(114), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                  {'我的出借'}
                </Text>
              </View>
            </View>
            <View style={{flex:1, borderWidth:0, flexDirection:'row', justifyContent:'space-evenly'}}>
              <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                <Image 
                  source={ImageStores.sy_3}
                  resizeMode={'stretch'}
                  style={{marginLeft:scaleSize(105), marginTop:scaleSize(39), width:scaleSize(150), height:scaleSize(150)}}/>
                <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(87), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                  {'我的红包'}
                </Text>
              </View>
              <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                <Image 
                  source={ImageStores.sy_3}
                  resizeMode={'stretch'}
                  style={{marginLeft:scaleSize(48), marginTop:scaleSize(39), width:scaleSize(150), height:scaleSize(150)}}/>
                <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(87), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                  {'我的嘉金币'}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderItemView() {
    let views = [];
    let data = [
      {
        img:ImageStores.me_7,
        title:'回款日历',
        callback:() => this.Calendar4Payback('kkkkkkk'),
      },
      {
        img:ImageStores.me_8,
        title:'风险评测',
        callback:()=>{},
      },
      {
        img:ImageStores.me_7,
        title:'客户服务',
        callback:()=>{this.props.navigation.navigate('RotateAnimate')},
      },
      {
        img:ImageStores.me_8,
        title:'我的二维码',
        callback:()=>{this.props.navigation.navigate('RegisterPage')},
      },
    ]
    data.map((item, index) => {
      views.push(
        <TouchableHighlight key={index}
          underlayColor='rgba(0,0,0,0)'
          onPress={item.callback}>
          <View style={{backgroundColor:'#ffffff', width:GlobalStyles.WINDOW_WIDTH}}>
            <View style={{marginLeft:scaleSize(63), marginRight:scaleSize(63), height:scaleSize(135), flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
                <Image source={item.img} resizeMode={'stretch'} style={{width:scaleSize(66), height:scaleSize(66), alignSelf:'center'}}/>
                <Text style={{marginLeft:scaleSize(36), alignSelf:'center', fontSize:scaleSize(42), color:'#989898'}}>{item.title}</Text>
              </View>
              <Image source={ImageStores.me_6} resizeMode={'stretch'} style={{width:scaleSize(27), height:scaleSize(45), alignSelf:'center'}}/>
            </View>
            <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>
          </View>
        </TouchableHighlight>
      )
    })
    return (
      <View style={{marginTop:scaleSize(27)}}>
        {views}
      </View>
    )
  }

  renderScrollView() {
    return (
      <View>
        {this.renderGridView()}
        {this.renderItemView()}
      </View>
    )
  }

  Calendar4Payback(str) {
    console.log(str);
    this.props.navigation.navigate('Calendar4Payback');
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
  parallax_stickyHeader: {
    justifyContent: 'center',
    alignItems:'center',
    height:scaleSize(150),
    backgroundColor:'#e7142d',
  },
})
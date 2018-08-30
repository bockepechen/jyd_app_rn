import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  Linking,
  DeviceEventEmitter
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {ImageStores} from '../../../res/styles/ImageStores';
import AppStatusBar from '../../common/AppStatusBar';
import ModalView from '../../common/ModalView';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import Utils from '../../utils/Utils';

let refreshRate = 60;
export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      isLoading:false,
      isRefresh: false,
      isEye: true,
      image_eye: ImageStores.me_3,
      modaltext1:"嘉e贷联手江西银行",
      modaltext2:"积极响应国家政策",
      modaltext3:"银行存管系统正式上线，请先开通银行存管账户",
      modaltext4:"开通后即可进行充值、提现、出借等操作",
      httpRes:{},
      totalAmount:0,
      sumRepay:0,
      availBal:0,
      fundAccountInfo:{}
    }
  }

  componentDidMount(){
    this.getInfoData()
  }

  async getInfoData() {
    this.setState({
      isLoading:true
    });
    let url = await '/personCenter';
    global.NetReqModel.tel_phone = await "15822753827";
    global.NetReqModel.jyd_pubData.user_id = await "91";
    global.NetReqModel.jyd_pubData.token_id = await "123235h5e3111";
    console.log(JSON.stringify(global.NetReqModel));
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        this.setState({
            isLoading:false,
            httpRes : result,
            totalAmount:result.totalAmount,
            sumRepay:result.sumRepay,
            availBal:result.availBal,
            fundAccountInfo:result.fundAccountInfo
        })
      }
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
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

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  async checkUserStatus(next_url){
    // this.goto('AccountAgreementPage');
    // global.NetReqModel.tel_phone = await "15822854761";
    // global.NetReqModel.jyd_pubData.user_id = await "82";
    // global.NetReqModel.jyd_pubData.token_id = await "0001222";
    // this.goto('AccountSetPwdPage',{
    //   url:'/transPwd/setPassword',
    //   jsonObj:global.NetReqModel,
    // });
    // global.NetReqModel.user_ip = '123';
    //       global.NetReqModel.tel_phone =  "15822753827";
    //       global.NetReqModel.jyd_pubData.user_id =  "204";
    //       global.NetReqModel.jyd_pubData.token_id =  "123235h5e3";
    //       this.goto('BindCardNewPage',{
    //         url:'/bindCard',
    //         jsonObj:global.NetReqModel,
    //         title:'绑定银行卡'
    //       });
    this.goto(next_url)
    return false;
    let url = await '/common';
    global.NetReqModel.tel_phone = await "13752133744";
    global.NetReqModel.jyd_pubData.user_id = await "85";
    global.NetReqModel.jyd_pubData.token_id = await "111111";
    console.log(JSON.stringify(global.NetReqModel));
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        global.NetReqModel.account_id = result.jx_data.account_id;
        global.NetReqModel.bank_no = result.jx_data.bank_no;
        global.NetReqModel.sign_status = result.jx_data.sign_status;
        global.NetReqModel.tradepwd_status = result.jx_data.tradepwd_status;
        if(!global.NetReqModel.account_id || global.NetReqModel.account_id == ''){
          this.goto('AccountOpeningPage')
        }
        else if(!global.NetReqModel.bank_no || global.NetReqModel.bank_no == ''){
          global.NetReqModel.user_ip = '123';
          global.NetReqModel.tel_phone =  "15822753827";
          global.NetReqModel.jyd_pubData.user_id =  "204";
          global.NetReqModel.jyd_pubData.token_id =  "123235h5e3";
          this.goto('BindCardNewPage',{
            url:'/bindCard',
            jsonObj:global.NetReqModel,
            title:'绑定银行卡'
          });
        }
        else if(!global.NetReqModel.tradepwd_status || global.NetReqModel.tradepwd_status == '0'){
          this.goto('AccountSetPwdPage',{
            url:'/transPwd/setPassword',
            jsonObj:global.NetReqModel,
            title:'设置交易密码'
          });
        }
        else if(!global.NetReqModel.sign_status || global.NetReqModel.sign_status == '0'){
          this.goto('AccountAgreementPage');
        }
        else{
          this.goto(next_url)
        }
      }
    })
    .catch((e) => {
      console.log(e);
    })
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
          <Text style={{marginTop:scaleSize(54), fontSize:scaleSize(60), fontWeight:'bold', color:'#ffffff'}}>{this.state.isEye? Utils.formatMoney(this.state.totalAmount,2) :'******'}</Text>
        </View>
        <View style={{backgroundColor:'white', width:1, height:scaleSize(210)}}/>
        <View style={{flex:1, flexDirection:'column', alignItems:'center'}}>
          <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(48), color:'#ffffff'}}>{'累计回报(元)'}</Text>
          <Text style={{marginTop:scaleSize(54), fontSize:scaleSize(60), fontWeight:'bold', color:'#ffffff'}}>{this.state.isEye? Utils.formatMoney(this.state.sumRepay,2) :'******'}</Text>
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
          <Text style={{marginTop:scaleSize(39), width:scaleSize(555), fontSize:scaleSize(66), fontWeight:'200', color:'#ff3a49'}}>{this.state.isEye? this.state.availBal :'******'}</Text>
        </View>
        <View style={{marginTop:scaleSize(81), marginLeft:scaleSize(21), height:scaleSize(84), flexDirection:'row'}}>
          <TouchableHighlight
            onPress={()=>{this.checkUserStatus('RechargePage')}}
            underlayColor='rgba(0,0,0,0)'>
            <ImageBackground source={ImageStores.me_5} resizeMode={'stretch'} style={{width:scaleSize(216), height:scaleSize(84), alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:scaleSize(48), fontWeight:'200', color:'#ffffff'}}>{'充值'}</Text>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={()=>{this.checkUserStatus('WithdrawPage')}}
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
        <TouchableHighlight onPress={()=>this.goto('AccountSecurityPage')} underlayColor='rgba(0,0,0,0)'>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image 
              source={ImageStores.me_10} 
              resizeMode={'stretch'} 
              style={{width:scaleSize(96), height:scaleSize(96)}}/>
            <Text style={{marginLeft:scaleSize(39), fontSize:scaleSize(48), color:'#ffffff'}}>{`用户${global.NetReqModel.tel_phone}`}</Text>
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
        ref="pullToRefresh"
        onScroll = {
          (e) => {
            if(!this.state.isLoading && e.nativeEvent.contentOffset.y+refreshRate < 0){
              this.getInfoData();
            }
          }
        }
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
              <TouchableOpacity 
                onPress={()=>{this.goto('AssetPage')}}
                style={{flex:1, borderWidth:0, flexDirection:'row'}}
              >
                <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                  <Image 
                    source={ImageStores.me_44}
                    resizeMode={'stretch'}
                    style={{marginLeft:scaleSize(105), marginTop:scaleSize(66), width:scaleSize(150), height:scaleSize(150)}}/>
                  <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(114), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                    {'资产详情'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{this.goto('MyLoanPage')}}
                style={{flex:1, borderWidth:0, flexDirection:'row'}}
              >
                <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                  <Image 
                    source={ImageStores.me_45}
                    resizeMode={'stretch'}
                    style={{marginLeft:scaleSize(48), marginTop:scaleSize(66), width:scaleSize(150), height:scaleSize(150)}}/>
                  <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(114), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                    {'我的出借'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex:1, borderWidth:0, flexDirection:'row', justifyContent:'space-evenly'}}>
              <TouchableOpacity
                onPress={()=>{this.goto('RedPacketPage')}}
                style={{flex:1, borderWidth:0, flexDirection:'row'}}
              >
                <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                  <Image 
                    source={ImageStores.me_46}
                    resizeMode={'stretch'}
                    style={{marginLeft:scaleSize(105), marginTop:scaleSize(39), width:scaleSize(150), height:scaleSize(150)}}/>
                  <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(87), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                    {'我的红包'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{
                  global.NetReqModel.page_number = '1'
                  this.goto('MyGoldPage',{
                    url:'/integral',
                    jsonObj:global.NetReqModel,
                    title:'我的嘉金币'
                  })}
                }
                style={{flex:1, borderWidth:0, flexDirection:'row'}}
              >
                <View style={{flex:1, borderWidth:0, flexDirection:'row'}}>
                  <Image 
                    source={ImageStores.me_47}
                    resizeMode={'stretch'}
                    style={{marginLeft:scaleSize(48), marginTop:scaleSize(39), width:scaleSize(150), height:scaleSize(150)}}/>
                  <Text style={{marginLeft:scaleSize(48), marginTop:scaleSize(87), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>
                    {'我的嘉金币'}
                  </Text>
                </View>
              </TouchableOpacity>
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
        img:ImageStores.me_48,
        title:'回款日历',
        callback:() => this.Calendar4Payback('kkkkkkk'),
      },
      {
        img:ImageStores.me_49,
        title:'风险评测',
        callback:()=>{this.showModalView(true,this.renderModal())},
      },
      {
        img:ImageStores.me_50,
        title:'客户服务',
        callback:()=>{this.showModalView(true,this.renderTelModal())},
      },
      {
        img:ImageStores.me_51,
        title:'我的二维码',
        callback:()=>{this.goto('QcodePage',{
          url:'/qrCode',
          title:'我的二维码',
          jsonObj:global.NetReqModel
        })},
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

  renderModal(){
    return (
      <View
        style={{flex:1,}}
        visible={this.state.modalVisible}
        isPressClosed={false}
      >
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.3)'}}>
            <View style={{flexDirection:'column',justifyContent:'center',height:scaleSize(891),width:scaleSize(915),borderRadius:scaleSize(30),backgroundColor:'#fff'}} >
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext1}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(45)}}>
                <Image source={ImageStores.me_30} resizeMode={'stretch'} style={{width:scaleSize(522), height:scaleSize(201)}}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(60)}}>
                <Text style={{color:'#998675',fontSize:scaleSize(42)}}>{this.state.modaltext2}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(54)}}>
                <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext3}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext4}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(54)}}>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{this.showModalView(false)}}>
                  <ImageBackground 
                    source={ImageStores.cp_2} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'稍后再说'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{this.goto('AccountOpeningPage')}}>
                  <ImageBackground 
                    source={ImageStores.sy_15} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'立即开通'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
    )
  }

  renderTelModal(){
    return (
      <View
        style={{flex:1,}}
        visible={this.state.modalTelVisible}
        isPressClosed={false}
      >
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.3)'}}>
            <View style={{flexDirection:'column',justifyContent:'center',height:scaleSize(360),width:scaleSize(915),borderRadius:scaleSize(30),backgroundColor:'#fff'}} >
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(50)}}>
                <Text style={{color:'#998675',fontSize:scaleSize(60)}}>{'15822854761'}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(39)}}>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{this.showModalView(false)}}>
                  <ImageBackground 
                    source={ImageStores.me_35} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(135), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:'#656565'}}>{'取消'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{
                    Linking.openURL(`tel:${`15822854761`}`)
                  }}>
                  <ImageBackground 
                    source={ImageStores.me_36} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(135), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(36), fontWeight:'200', color:'#FFFFFF'}}>{'呼叫'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
    )
  }

  showModalView(visible,renderView) {
    DeviceEventEmitter.emit('callModal',visible,renderView);
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
        {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
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
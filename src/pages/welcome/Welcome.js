import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import InitialDao from '../../dao/InitialDao';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {scaleSize} from '../../utils/FitViewUtils';
import { AppConfig } from '../../config/AppConfig';
import {AsyncStorage} from 'react-native'

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.initialDao = new InitialDao();
    this.dataResponsitory = new DataResponsitory();
    global.InitNetData = {}
    this.state = {
      countDownTime: 3,
      ifShowJumpBtn: false,
      ifFirstOpen: 'loading'
    }
  }

  componentDidMount() {
    SplashScreen.hide();
    this.initUserinfo()
    this.getIp('appId')
    this.getInfoData()
  }

  componentWillMount() {
    this.init();
  }

  async initUserinfo(){
    await AsyncStorage.getItem(Storage_Key.LS_REG_USERINFO, (error, result) => {
      if (!error) {
          console.log('init userinfo')
          result = JSON.parse(result)
          console.log(result);
          if(result!=null){
            global.NetReqModel.jyd_pubData.user_id = result.user_id;
            global.NetReqModel.jyd_pubData.user_name = result.user_name;
            global.NetReqModel.jyd_pubData.token_id = result.token_id
            global.NetReqModel.tel_phone = result.tel_phone
            global.NetReqModel.red_envelop_total = result.red_envelop_total;
            global.NetReqModel.account_id = result.account_id;
            global.NetReqModel.bank_no = result.bank_no;
            global.NetReqModel.sign_status = result.sign_status;
            global.NetReqModel.tradepwd_status = result.tradepwd_status;
          }
      } else {
        console.log('init userinfo error !!!!!!!')
      }
    })
  }

  async getIp(key) {
    return await AsyncStorage.getItem(key, (error, result) => {
      if (!error) {
        console.log('update ip');
          console.log(result);
          if(result!=null){
            AppConfig.REQUEST_HOST = result
          }
      } else {
        console.log('update ip error !!!!!!!')
      }
    })
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
    })
    .catch((e) => {
      console.log(e);
    })
  }

  async init() {
    let initialData = await this.initialDao.getInitailData('AppOpen');
    if (initialData) {
      if(initialData.ifFirstOpen == 'first' || initialData.ifFirstOpen == 'unfirst'){
        await this.initialDao.saveInitialData('AppOpen', {ifFirstOpen: 'unfirst'});
        this.setState({
          ifFirstOpen: 'unfirst'
        });
      }else{
        await this.initialDao.saveInitialData('AppOpen', {ifFirstOpen: 'first'});
        this.setState({
          ifFirstOpen: 'first'
        });
      }
      this.countDown();
    } else {
      this.setState({
        ifFirstOpen:'first'
      })
      await this.initialDao.saveInitialData('AppOpen', {ifFirstOpen: 'first'});
    }
  }

  onSwipe = (index) => {
    if(index === 2) {
      this.setState({ifShowJumpBtn:true});
      this.countDown();
    }
  }

  countDown() {
    this.timer = setInterval(() => {
      if (this.state.countDownTime === 0) {
        this.props.navigation.navigate('App');
      } else {
        this.setState({
          countDownTime: this.state.countDownTime - 1
        })
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    let jumpBtn = 
      <TouchableOpacity
        onPress={()=>{
          this.props.navigation.navigate('App');
        }}  
      >
        <View style={{
          backgroundColor:'rgba(255,255,255,0.1)',
          height:30,
          justifyContent:'center', 
          alignItems:'center',
          position:'absolute',
          left:Dimensions.get('window').width*0.70,
          right:Dimensions.get('window').width*0.1,
          top:30,
          borderRadius:3,
          borderWidth:1,
          borderColor:'white'
        }}>
          <Text style={{
            fontSize:13,
            color:'white'
          }}>{`跳过广告 ${this.state.countDownTime}`}
          </Text>
        </View>
      </TouchableOpacity>
      let FirstView = 
        <View style={GlobalStyles.rootContainer}>
          <Swiper
            horizontal={true}
            onIndexChanged={this.onSwipe}
            activeDotColor='#998874'
            dotColor='#c7b298'
            paginationStyle={{bottom:scaleSize(24),marginBottom:scaleSize(222)}}
            loop={false}>
            <Image source={ImageStores.hy_1} style={styles.banner_image} />
            <Image source={ImageStores.hy_2} style={styles.banner_image} />
            <Image source={ImageStores.hy_3} style={styles.banner_image} />
          </Swiper>
          {this.state.ifShowJumpBtn?jumpBtn:null}
        </View>
      let UnFirstView = 
        <View style={GlobalStyles.rootContainer}>
          <Image source={ImageStores.hy_3} style={styles.banner_image} />
        </View>
       let loadingView = 
          <View></View>
    switch(this.state.ifFirstOpen){
      case 'first':
        return FirstView
      case 'unfirst':
        return UnFirstView
      case 'loading':
        return loadingView
    }
  }
}

const styles = StyleSheet.create({
  banner_image:{
    flex:1,
    width:GlobalStyles.WINDOW_WIDTH,
    height:GlobalStyles.WINDOW_HEIGHT
  }
})
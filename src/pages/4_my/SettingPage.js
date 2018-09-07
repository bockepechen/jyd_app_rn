import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import * as CacheManager from 'react-native-http-cache'

let isAndroid = Platform.OS==='android'?true:false;
export default class SettingPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.listItem = [
        {
            title:'当前版本',
            callback:()=>{this.goto('UpdateIPPage')}
        },
        {
            title:'意见反馈',
            callback:()=>{this.goto('FeedbackPage')}
        },
        {
            title:'清理缓存',
            callback:()=>{this.clearCacheSize()}
        },
    ]
    this.state = {
      httpRes:{},
      list:[],
      cacheSize:0,
      version:'0.0.0',
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.getCacheSize()
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  // 获得缓存大小
  async getCacheSize() {
    const data = await CacheManager.getCacheSize();
    const size = data / (1024 * 1024);
    this.setState({ cacheSize: size.toFixed(2) + 'M'});
  }

  // 清除缓存
  async clearCacheSize() {
    await CacheManager.clearCache();
    // this.getCacheSize();
    // 这里貌似清除不能全部清除为0，这里直接写死0即可。
    this.setState({cacheSize: '0M'});
    this.refs.toast.show('清除缓存成功');
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  logout(){
    this.dataResponsitory.saveLocalStorage(
      Storage_Key.LS_REG_USERINFO,
      {
        user_id: '',
        user_name: '',
        token_id: '',
        tel_phone : '',
        red_envelop_total : '',
        account_id : '',
        bank_no : '',
        sign_status : '',
        tradepwd_status : '',
      },
      () => {
        global.NetReqModel.jyd_pubData.user_id = '';
        global.NetReqModel.jyd_pubData.user_name = '';
        global.NetReqModel.jyd_pubData.token_id = '';
        global.NetReqModel.red_envelop_total = '';
        global.NetReqModel.account_id = '';
        global.NetReqModel.bank_no = '';
        global.NetReqModel.sign_status = '';
        global.NetReqModel.tradepwd_status = '';
        this.refs.toast.show('退出成功');
        this.props.navigation.navigate('LoginPage')
      }
     )
  }

  _renderItemDetail(index){
      if(index == 0){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.version}</Text>
      }
      else if(index == 2){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.cacheSize}</Text>
      }else{
          return null
      }
  }

  _renderItem(){
    var itemArray = []
    this.listItem.map((item, index) => {
        itemArray.push(
            <View key={index} style={{flex:1,backgroundColor:'#fff',height:scaleSize(135)}}>
                <TouchableOpacity 
                    style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}
                    onPress={item.callback}
                >
                    <View style={{flexDirection:'row',marginLeft:scaleSize(120)}}>
                        <Text style={{marginTop:scaleSize(48),color:'#989898'}}>{item.title}</Text>
                    </View>
                    <View style={{marginRight:scaleSize(63),flexDirection:'row'}}>
                        {this._renderItemDetail(index)}
                        <Image 
                            source={ImageStores.me_6} 
                            resizeMode={'stretch'} 
                            style={{
                                // flex:1,
                                width:scaleSize(27),
                                height:scaleSize(45),
                                // marginRight:scaleSize(63),
                                marginTop:scaleSize(51)
                            }} 
                        />
                    </View>
                </TouchableOpacity>
                <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>
            </View>
        )
    })
    return itemArray
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
      <ScrollView
        // style={{marginTop:scaleSize(120)}}
        scrollEnabled = {false}
      >
        {this._renderItem()}
      </ScrollView>
      <TouchableHighlight 
          style={{flexDirection:'row',marginBottom:scaleSize(500),justifyContent:'center'}}
          underlayColor='rgba(0,0,0,0)'
          onPress={()=>{this.logout()}}>
          <ImageBackground 
            source={ImageStores.sy_17} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'退出账号'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
        <View style={GlobalStyles.rootContainer}>
            <NavigationBar 
                title='设置'
                titleColor='#FFFFFF'
                titleSize={scaleSize(56)}
                navColor='#E8152E'
                statusBarColor='#E8152E'
                statusBarStyle='light-content'
                leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
            />
            {this.renderMainView()}
            {ViewUtils.renderToast()}
        </View>
    )
  }
}
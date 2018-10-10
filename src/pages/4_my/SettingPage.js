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
import { StackActions,NavigationActions } from 'react-navigation';
import {AsyncStorage} from 'react-native'
import ModalView from '../../common/ModalView';

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
            callback:()=>{
              if(!this.checkLogin()){
                return false
              }
              this.goto('FeedbackPage')
            }
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

  checkLogin(){
    if(!global.NetReqModel.jyd_pubData.token_id || global.NetReqModel.jyd_pubData.token_id == ''){
      this.goto('LoginPage')
      return false
    }else{
      return true
    }
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
    this.setState({cacheSize: '0M'},()=>{
      AsyncStorage.getItem(Storage_Key.LS_REG_USERINFO, (error, result) => {
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
    });
    this.refs.toast.show('清除缓存成功');
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  showModalView(isShow,modalContentView, ref_modalView) {
      if (isShow) {
        ref_modalView.show(modalContentView);
      } else {
        ref_modalView.close();
      }
  }

  renderModal() {
    return (
      <View
        style={{ flex: 1, }}
        visible={this.state.modalTelVisible}
        isPressClosed={false}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', height: scaleSize(360), width: scaleSize(915), borderRadius: scaleSize(30), backgroundColor: '#fff' }} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(50) }}>
              <Text style={{ color: '#998675', fontSize: scaleSize(50) }}>{'是否退出当前账号？'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(39) }}>
              <TouchableHighlight
                style={{ flexDirection: 'row', justifyContent: 'center' }}
                underlayColor='rgba(0,0,0,0)'
                onPress={() => { this.showModalView(false,null,this.refs.modalView) }}>
                <ImageBackground
                  source={ImageStores.me_35}
                  resizeMode={'stretch'}
                  style={{ width: scaleSize(336), height: scaleSize(135), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scaleSize(36), fontWeight: '200', color: '#656565' }}>{'取消'}</Text>
                </ImageBackground>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flexDirection: 'row', justifyContent: 'center' }}
                underlayColor='rgba(0,0,0,0)'
                onPress={() => {
                  this.logout()
                }}>
                <ImageBackground
                  source={ImageStores.me_36}
                  resizeMode={'stretch'}
                  style={{ width: scaleSize(336), height: scaleSize(135), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scaleSize(36), fontWeight: '200', color: '#FFFFFF' }}>{'确定'}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    )
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
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'TabPage'}),
          ],
        });
        this.props.navigation.dispatch(resetAction);
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
          onPress={()=>{this.showModalView(true, this.renderModal(),this.refs.modalView)}}>
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
            <ModalView ref='modalView'/>
        </View>
    )
  }
}
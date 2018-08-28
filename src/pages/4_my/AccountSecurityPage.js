import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import LoadingIcon from '../../common/LoadingIcon';
import Utils from '../../utils/Utils';

let isAndroid = Platform.OS==='android'?true:false;
export default class AccountSecurityPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.listItem = [
        {
            title:'用户信息',
            callback:()=>{this.goto('PersonInfoPage')}
        },
        {
            title:'我的银行卡',
            callback:()=>{this.goto('BankCardListPage')}
        },
        {
            title:'手机号码',
            // callback:()=>{this.goto('AuthPhoneNumPage')}
            callback:this.updateTel
        },
        {
            title:'联系地址',
            callback:()=>{this.goto('AddressPage')}
        },
        {
            title:'修改登录密码',
            callback:()=>{this.goto('ResetpwdPage')}
        },
        {
            title:'修改交易密码',
            callback:()=>{this.goto('ResetTradepwdPage')}
        },
    ]
    this.state = {
      httpRes:{},
      list:[],
      tel:'138****1234',
      cardInfo:'工商银行(2341)',
      isLoading: false,
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }
  
  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  updateTel = async () => {
    this.setState({isLoading:true});
    // 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
    let adaptAuthCodeCD = await this.dataResponsitory.adaptAuthCodeCD();
    // 跳转下页面参数设置
    let navigation_params = {
      pageTitle:'忘记密码',
      nextPage:'ResetPwdPage',
      tel: this.telNum,
      cryptTel: `${global.NetReqModel.tel_phone.substring(0,3)} **** ${global.NetReqModel.tel_phone.substring(7)}`,
      authcodeCD: adaptAuthCodeCD.authcodeCD
    };
    if  (adaptAuthCodeCD.ifSendAuthCode) {
      // 设置远程接口访问参数 (同步执行)
      global.NetReqModel.tel_phone = await global.NetReqModel.tel_phone;
      global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
      let url = await '/password/forgetPwd';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
       .then((result) => {
         // 返回数据，关闭Loading动画
         this.setState({isLoading:false}, () => {
           if (result.return_code === '0000') {
             global.NetReqModel.jyd_pubData.user_id = result.user_id;
             this.props.navigation.navigate('AuthPhoneNumPage', navigation_params);
           } else {
            this.refs.toast.show(result.return_msg);
           }
         })
       })
       .catch((e) => {
         console.log(e);
         this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
         // 关闭Loading动画
         if(this.state.isLoading) {
           this.setState({isLoading:false});
         }
       })
    } else {
      this.setState({isLoading:false},() => {
        this.props.navigation.navigate('AuthPhoneNumPage', navigation_params);
      });
    }
  }

  _renderItemDetail(index){
      if(index == 1){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.cardInfo}</Text>
      }
      else if(index == 2){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.tel}</Text>
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
            {this.state.isLoading?(<LoadingIcon />):null}
            {ViewUtils.renderToast()}
        </View>
    )
  }
}
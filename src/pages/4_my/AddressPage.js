import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';
import LoadingIcon from '../../common/LoadingIcon';
import { AppConfig } from '../../config/AppConfig';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class AddressPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isRotate:true,
            isLoading: false,
            user_name:'',
            tel_phone:'',
            address:''
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
        this.getInfoData()
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    async getInfoData() {
      this.setState({
        isLoading:true
      });
      let url = await '/accountSafety/contactInfo';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        if(result.return_code == '0000'){
          this.setState({
              isLoading:false,
              tel_phone : result.tel_phone,
              address : result.address,
              user_name : result.user_name,
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

    async updateInfo() {
      this.setState({
        isLoading:true
      });
      let url = await '/accountSafety/saveContact';
      global.NetReqModel.tel_phone = this.state.tel_phone;
      global.NetReqModel.address = this.state.address;
      global.NetReqModel.real_name = this.state.user_name;
      console.log(JSON.stringify(global.NetReqModel));
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if(result.return_code == '0000'){
          this.setState({
              isLoading:false,
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

    navGoback = () => {
        this.props.navigation.goBack();
    }

    renderSubTitleLine(subTitle, topDistance) {
        return (
          <View style={{ flexDirection:'row', alignItems:'center', marginLeft:scaleSize(60), marginRight:scaleSize(60)}}>
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

    renderRemark(){
        return (
            <View
                style={{
                    flex:1,
                    position:'absolute', 
                    top:scaleSize(1150),
                    width:GlobalStyles.WINDOW_WIDTH, 
                    alignItems:'center',
                }}
            >
                {this.renderSubTitleLine('温馨提示')}
                <View style={{marginTop:scaleSize(66),marginLeft:scaleSize(110),marginRight:scaleSize(110)}}>
                    <Text style={{fontSize:scaleSize(36), color:'#989898'}}>1、修改当前认证手机号码时,您的银行存管手机号码将会同步修改</Text>
                    <Text style={{fontSize:scaleSize(36),marginTop:scaleSize(18),color:'#989898'}}>2、如有问题,请联系客服400-8780-777</Text>
                </View>
            </View>
        )
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              position:'absolute', 
              top:scaleSize(120), 
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(550), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:scaleSize(81), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <Text style={{color:'#998675',fontSize:scaleSize(36)}}>{'默认联系人:'}</Text>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'默认联系人'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.user_name}
                  onChangeText = {(p) => {this.setState({
                    user_name:p
                  })}}
                  />
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <Text style={{color:'#998675',fontSize:scaleSize(36)}}>{'联系电话:'}</Text>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  maxLength={11}
                  keyboardType={kbType}
                  clearButtonMode={'while-editing'}
                  placeholder={'联系电话'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.tel_phone}
                  onChangeText = {(p) => {this.setState({
                    tel_phone:p
                  })}}
                  />
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <Text style={{color:'#998675',fontSize:scaleSize(36)}}>{'详细地址:'}</Text> 
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  keyboardType={kbType}
                  clearButtonMode={'while-editing'}
                  placeholder={'详细地址'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.address}
                  onChangeText = {(p) => {this.setState({
                    address:p
                  })}}
                  />
              </View>
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(56)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={()=>{this.updateInfo()}}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'提交'}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        )
      }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar 
                        title={'修改地址'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                    />
                    <View>
                    <Image
                        source={ImageStores.dl_6}
                        resizeMode={'stretch'}
                        style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(456)}}/>
                        {this.renderInputView()}
                        {/* {this.renderRemark()} */}
                </View>
                {this.state.isLoading?(<LoadingIcon />):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
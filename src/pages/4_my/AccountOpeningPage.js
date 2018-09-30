import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
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
import DataResponsitory from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import { StackActions } from 'react-navigation';

export default class AccountOpeningPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
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

    accountOpen(){
      this.setState({
        isLoading: true,
      })
      if(!this.name || this.name == '' ){
        this.refs.toast.show('请输入姓名');
        this.setState({
          isLoading:false
        })
        return false;
      }
      if(!this.card_no || this.card_no == '' ){
        this.setState({
          isLoading:false
        })
        this.refs.toast.show('请输入身份证号');
        return false
      }
      global.NetReqModel.name = this.name
      global.NetReqModel.card_no = this.card_no
      console.log(global.NetReqModel)
      this.goto('AccountOpeningWvPage',{
          url:'/openAccount',
          title:'银行存管账号',
          jsonObj:global.NetReqModel
      })
      if(this.state.isLoading){
        this.setState({
          isLoading:false
        })
      }
    }

    navGoback = () => {
        // this.props.navigation.goBack();
        this.props.navigation.dispatch(StackActions.popToTop());
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
                    // position:'absolute', 
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

    renderStepImg(){
      return (
        <View style={{width:GlobalStyles.WINDOW_WIDTH,marginTop:scaleSize(102)}}>
          <View style={{width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}>
            <Image 
              source={ImageStores.me_12}
              resizeMode={'stretch'}
              style={{width:scaleSize(774), height:scaleSize(144)}}
            />
          </View>
          <View style={{marginTop:scaleSize(33),flexDirection:'row'}}>
            <Text style={{marginLeft:scaleSize(195),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'开通存管账号'}</Text>
            <Text style={{marginLeft:scaleSize(102),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'设置交易密码'}</Text>
            <Text style={{marginLeft:scaleSize(120),color:'#fff',fontWeight:'bold',fontSize:scaleSize(36)}}>{'签订协议'}</Text>
          </View>
        </View>
      )
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              marginTop:scaleSize(93),
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(699), backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'真实姓名'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.name = p}}
                  value = {this.name}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'身份证号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  onChangeText = {(p) => {this.card_no = p}}
                  value = {this.card_no}
                  />
              </View>
              <View style={{marginTop:scaleSize(54), width:scaleSize(999), height:scaleSize(90), borderBottomWidth:scaleSize(2), borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center",}}>
                <TextInput 
                  editable={false}
                  style={{flex:1,color:'#996875' ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  clearButtonMode={'while-editing'}
                  placeholder={'手机号'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value = {global.NetReqModel.tel_phone}
                  />
              </View>
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(42)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={()=>{this.accountOpen()}}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontWeight:'bold' ,fontSize:scaleSize(36),color:'#FFFFFF'}}>{'开通江西银行存管账号'}</Text>
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
                        title={'银行存管账号'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                    />
                    <View>
                    <ImageBackground
                        source={ImageStores.me_1}
                        resizeMode={'stretch'}
                        style={{width:scaleSize(1242), height:scaleSize(837)}}>
                      {this.renderStepImg()}
                      {this.renderInputView()}
                      {this.renderRemark()}
                    </ImageBackground>
                </View>
                {this.state.isLoading?(<LoadingIcon isModal={true} />):null}
                {ViewUtils.renderToast()}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import LoadingIcon from '../../common/LoadingIcon';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import ActionSheetShare from '../../common/ActionSheetShare';
import ShareUtil from '../../utils/ShareUtil';
import { StackActions } from 'react-navigation';

export default class InvitingFriendsPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isRotate:true,
            isLoading: false,
            isEyeOpen: false,
            validTime: 0,
            title:'邀请好友出借成功可得现金奖励',
            content:'邀请好友成功注册后，好友在注册之日起1年内参与嘉e优选服务出借成功后，邀请人可获得奖励；奖励可叠加，无门槛，无上限！'
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    navGoback = () => {
        this.props.navigation.dispatch(StackActions.popToTop());
    }

    goto(url,JsonObj){
        this.props.navigation.navigate(url,{
          data:JsonObj ? JsonObj : {}
        });
    }

    onSharePress() {
        this.actionsheetshare.show()
    }

    record(){
        global.NetReqModel.page_number = 1
        this.goto('InvitingRecordPage',{
            url:'/invest',
            jsonObj:global.NetReqModel,
            title:'邀请记录'
        })
    }

    //一键读取
    getRightButton(callBack) {
        return <TouchableOpacity
                style={{marginRight:scaleSize(54),}}
                onPress={callBack}>
                <View style={{flexDirection:'row'}}>
                    <Text
                        style={{color:'#fff',fontSize:scaleSize(49)}} 
                    >邀请记录
                </Text>
                </View>
            </TouchableOpacity>
    }

    shareWxToOne(){
        // 2	微信	
        // 3	朋友圈
        ShareUtil.share('测试','','https://jydrnserv.jiayidai.com:8282/JYD_RN_Serv/userCenter/share.jsp?icode='+global.NetReqModel.tel_phone,'嘉e贷',2,(code,message) =>{
          console.log('code===>'+code);  
          console.log('message===>'+message)
        });
    }

    shareWx(){
        // 2	微信	
        // 3	朋友圈
        ShareUtil.share('测试','','https://jydrnserv.jiayidai.com:8282/JYD_RN_Serv/userCenter/share.jsp?icode='+global.NetReqModel.tel_phone,'嘉e贷',3,(code,message) =>{
          console.log('code===>'+code);  
          console.log('message===>'+message)
        });
    }

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              position:'absolute', 
              top:scaleSize(600), 
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <ImageBackground
                source={ImageStores.cp_7}
                resizeMode={'stretch'}
                style={{width:scaleSize(1242),height:scaleSize(522),justifyContent:'center',alignItems:'center'}}
            >
                <Text style={{fontSize:scaleSize(60),fontWeight:'bold',color:'#ff3a49'}}>{this.state.title}</Text>
                <Text style={{fontSize:scaleSize(42),width:scaleSize(1000),color:'#989898',marginTop:scaleSize(66)}}>{this.state.content}</Text>
            </ImageBackground>
            <TouchableHighlight 
              style={{marginTop:scaleSize(174)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={()=>this.onSharePress()}>
              <ImageBackground 
                source={ImageStores.cp_8} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(1242), height:scaleSize(210), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'分享给好友'}</Text>
              </ImageBackground>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={()=>{
                    console.log(global.InitNetData.httpRes.inviteRule_url)
                    this.goto('QualificationItemPage',{
                        url:global.InitNetData.httpRes.inviteRule_url,
                        jsonObj:global.NetReqModel,
                        title:'邀请规则'
                    })
                }}
            >
                <Text style={{fontSize:scaleSize(48), color:'#998675'}}>{'邀请规则'}</Text>
            </TouchableHighlight>
          </View>
        )
      }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar 
                        title={'邀请好友'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                        rightButton={this.getRightButton(()=>this.record())}
                    />
                    <View>
                    <Image
                        source={ImageStores.fx_1}
                        resizeMode={'stretch'}
                        style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(1008)}}/>
                        {this.renderInputView()}
                </View>
                {this.state.isLoading?(<LoadingIcon />):null}
                {ViewUtils.renderToast()}
                <ActionSheetShare
                    shareWxToOneCallback={()=>{this.shareWxToOne()}}
                    shareWxCallback={()=>{this.shareWx()}}
                    ref={(actionsheetshare)=>{this.actionsheetshare = actionsheetshare}}
                />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
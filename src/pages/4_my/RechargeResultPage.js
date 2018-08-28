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
import { StackActions } from 'react-navigation';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class RechargeResultPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.navData = this.props.navigation.state.params.data;
        this.state = {
            isRotate:true,
            tel_pwdOld:'',
            tel_pwdNew:'',
            tel_pwdNewRe:'',
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

    renderInputView() {
        let kbType = Platform.OS==='ios'?'number-pad':'numeric';
        return (
          <View 
            style={{
              marginTop:scaleSize(320),
              width:GlobalStyles.WINDOW_WIDTH, 
              alignItems:'center',
            }}>
            <View style={{width:scaleSize(1134), height:scaleSize(789),justifyContent:'center', backgroundColor:'#ffffff', borderRadius:10, alignItems:'center'}}>
              <Image 
                source={this.navData.type == 1 ? ImageStores.me_41 : ImageStores.me_40}
                resizeMode={'stretch'} 
                style={{width:scaleSize(447),height:scaleSize(447)}}
              />
            </View>
            <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{width:scaleSize(1134), height:scaleSize(66)}}/>
            <TouchableHighlight 
              style={{marginTop:scaleSize(42)}}
              underlayColor='rgba(0,0,0,0)'
              onPress={()=>{
                this.props.navigation.dispatch(StackActions.popToTop());
              }}>
              <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50),fontWeight:'bold' ,fontSize:scaleSize(36),color:'#FFFFFF'}}>{'确定'}</Text>
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
                        title={this.navData.title}
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
                        {this.renderInputView()}
                      </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
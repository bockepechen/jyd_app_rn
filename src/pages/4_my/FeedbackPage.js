import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  TextInput,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

const isIOS = Platform.OS==='ios'?true:false;
export default class FeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state = {
        advice: '',
        adviceLength : 0,
        adviceEnale:true,
        linkcontent:''
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  
  navGoback = () => {
    this.props.navigation.goBack();
  }

  changeAdvice(text){
    this.setState({
        advice:text,
        adviceLength:text.length,
    })
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
        <View style={{marginLeft:scaleSize(63),marginTop:scaleSize(87)}}>
            <Text style={{fontSize:scaleSize(42),color:'#998675'}}>{'我们的进步需要您的宝贵意见'}</Text>
        </View>
        <View style={{width:scaleSize(1134),borderRadius:scaleSize(15),height:scaleSize(642),marginLeft:scaleSize(63),marginTop:scaleSize(39),backgroundColor:'#fff',padding:scaleSize(20)}}>
            <TextInput 
                editable = {this.state.adviceEnale}
                multiline = {true}
                maxLength = {200}
                numberOfLines = {10}
                style={{textAlignVertical: 'top'}}
                onChangeText={(text) => {this.changeAdvice(text)}}
                value={this.state.advice}
            />
            <Text style={{position:'absolute',fontSize:scaleSize(36),color:'#989898',alignSelf:'flex-end',right:scaleSize(51),bottom:scaleSize(45)}}>{`${this.state.adviceLength}/200`}</Text>
        </View>
        <View style={{marginTop:scaleSize(99),marginLeft:scaleSize(42)}}>
            <Text style={{fontSize:scaleSize(42),color:'#998675'}}>{'联系方式(选填)'}</Text>
        </View>
        <View style={{alignItems:'center',width:scaleSize(1134),borderRadius:scaleSize(15),height:scaleSize(240),marginLeft:scaleSize(63),marginTop:scaleSize(39),backgroundColor:'#fff',padding:scaleSize(20)}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:scaleSize(93), width:scaleSize(999), height:scaleSize(81), borderBottomWidth:GlobalStyles.PIXEL, borderBottomColor:'#c3c3c3', flexDirection:'row', alignItems:"center"}}>
                <TextInput 
                  style={{flex:1 ,marginLeft:scaleSize(18), marginRight:scaleSize(18), fontSize:scaleSize(36), paddingTop:0, paddingBottom:0}}
                  maxLength={11}
                  clearButtonMode={'while-editing'}
                  placeholder={'手机号码/邮箱/微信'}
                  placeholderTextColor='#c3c3c3'
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.linkcontent}
                  onChangeText = {(p) => {this.setState({linkcontent:p})}}
                  />
            </View>
        </View>
        <TouchableHighlight 
            style={{flexDirection:'row',marginTop:scaleSize(147),justifyContent:'center'}}
            underlayColor='rgba(0,0,0,0)'
            onPress={()=>{this.props.navigation.navigate('LoginPage')}}>
            <ImageBackground 
                source={ImageStores.sy_17} 
                resizeMode={'stretch'} 
                style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'发送'}</Text>
            </ImageBackground>
            </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
        <View style={GlobalStyles.rootContainer}>
            <NavigationBar 
                title='意见反馈'
                titleColor='#FFFFFF'
                titleSize={scaleSize(56)}
                navColor='#E8152E'
                statusBarColor='#E8152E'
                statusBarStyle='light-content'
                leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
            />
            {this.renderMainView()}
        </View>
    )
  }
}
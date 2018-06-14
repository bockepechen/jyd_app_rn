import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity ,
  Image,
  TextInput,
  AsyncStorage
} from 'react-native';
import {Transitioner} from 'react-navigation'
import NavigationBar from '../../common/NavigationBar';
import LoadingSpinner from '../../common/LoadingSpinner';
import Snackbars from '../../common/Snackbars';
import Utils from '../../utils/Utils';
import AutoHideKeyboard from '../../common/AutoHideKeyboard';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
var height = GlobalStyles.WINDOW_HEIGHT;
var width = GlobalStyles.WINDOW_WIDTH;
export default class SetPwdPage extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{
        tel:'',
        pwd:'',
        telShow:''
      },
      status:false,
      secureTextEntry:true,
      isLoading:false,
      isSnackbars:false,
    }
  }
  //回退按钮
  getLeftButton(callBack) {
    return <TouchableOpacity
        style={{marginLeft:16,marginTop:-2}}
        onPress={callBack}>
        <Image
            source={require('../../../res/images/back.png')}/>
    </TouchableOpacity>
  }
  //返回方法
  myBack(){
    this.props.navigation.goBack();
  }
  //跳转下一页方法
  goto(routeName,params){
    this.props.navigation.popToTop()
  }
  //监听密码输入框
  myOnChangeText(text){
    this.setState({
      user:{
        tel:this.state.user.tel,
        pwd:text,
      },
      status:text === '' ? false : true
    })
  }
  //监听手机号输入
  myOnChangeTel(text){
    this.setState({
      user:{
        tel:text,
      },
      status:text === '' ? false : true
    })
  }
  
  //第一次注册时 “下一步”的按钮
  myRegisterStepOneBtn(){
    this.setState({
      isLoading:!this.state.isLoading
    })
    setTimeout(
      () => {
        this.setState({
          isLoading:!this.state.isLoading,
        })
        this.goto();
      },
      1000
    );
  }
  //snackbars 提示信息方法  pwd
  mySnackbars(){
    if(this.state.user.pwd.length < 8){
      this.snackbarsContent = '密码太短';
      this.setState({
        isSnackbars:!this.state.isSnackbars
      })
      setTimeout(
        () => {
            this.setState({
              isSnackbars:!this.state.isSnackbars
            })
            this.snackbarsContent = '';
        },
        2000);
    } 
  }
  //snackbars 提示信息方法  tel
  mySnackbarsTel(){
    if(this.state.user.tel.length < 8){
      this.snackbarsContent = '手机号太短';
      this.setState({
        isSnackbars:!this.state.isSnackbars
      })
      setTimeout(
        () => {
            this.setState({
              isSnackbars:!this.state.isSnackbars
            })
            this.snackbarsContent = '';
        },
        2000);
    }else{
      let telArray = this.state.user.tel.split('');
      for(var i=0,len=telArray.length;i<len;i++){
        if(i>3 && i <8){
          telArray[i] = '*'
        }
      }
      let myTelShow = telArray.join('');
      this.setState({
        user:{
          tel:this.state.user.tel,
          pwd:this.state.user.pwd,
          telShow:myTelShow
        }
      });
      AsyncStorage.setItem('user',JSON.stringify(this.state.user),(error,result)=>{
        if (!error) {
          AsyncStorage.getItem('countDownDate',(error,result)=>{
              let datetime = Utils.fotmatDatetime(20,'yyyy-MM-dd hh:mm:ss')
              if(!error)
              {
                  if(!result){
                      AsyncStorage.setItem('countDownDate',datetime,(error1,result1)=>{
                          if(!error1){
                              this.goto('SmsCodePage', { countDownDatetime: datetime});
                          }
                      });
                  }
                  else{
                      var nowDate = new Date();
                      var oldDate = new Date(result.replace(/-/g,"/"))
                      this.goto('SmsCodePage', { countDownDatetime: oldDate > nowDate ? result : false});
                  }
              }
          })
        }
      });
    }
  }
  //清除输入内容
  clearText(){
    this.setState({
      user:{
        tel:this.state.user.tel,
        pwd:''
      },
      status:false
    })
  }
  //显示密码开关
  switchEye(){
    this.setState({
      secureTextEntry:!this.state.secureTextEntry
    })
  }
  //输入框的icon标
  inputIconRender(clearTextFunc,switchEyeFunc){
    if(this.state.status)
    {
      return <View style={styles.myInputIcon}>
              <Image 
                style={{marginRight:5}}
                onPress={clearTextFunc}
                source={require('../../../res/images/cross.png')}/>
              <Image 
                onPress={switchEyeFunc}
                source={require('../../../res/images/eye-close.png')}/>
            </View>
    }
    else{
      return <View style={styles.myInputIcon}>
            </View>
    }
  }
  //清除的cross icon
  iconCross = (myFunc)=>{
    return  <TouchableOpacity 
                onPress={myFunc}
                style={{marginRight:10}}
            > 
            <Image 
              source={require('../../../res/images/cross.png')}/>
        </TouchableOpacity>
  }
  //密码是否显示明文的 icon
  iconEye = (myFunc)=>{
    return <TouchableOpacity 
                onPress={myFunc}
                style={{paddingTop:3}}
           >
           <Image 
              onPress={myFunc}
              source={this.state.secureTextEntry ? require('../../../res/images/eye-close.png') : require('../../../res/images/eye.png')}/>
        </TouchableOpacity>
  }
  myrender() {
    //提示性信息
    let alertView =<Snackbars style={{position:'absolute',marginTop:-50,width: width, height: 50, backgroundColor: '#FE332F',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize: 16,color:'#fff',marginTop:8}}>{this.snackbarsContent}</Text>
                  </Snackbars>
    //加载loading 半透明页面
    let loadingSpinner = <LoadingSpinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
    //input的icon标
    let inputIcon = <View style={styles.myInputIcon}>
        {this.state.status ? this.iconCross(()=>this.clearText()) : null}
        {this.state.status ? this.iconEye(()=>this.switchEye()) : null}
      </View>
    //底部 验证码登陆和忘记密码
    let myBottom = <View style={styles.contentBottom}> 
                      <Text style={styles.contentBottomType}>验证码登陆</Text>
                      <View style={styles.myVertical}></View>
                      <Text style={styles.contentBottomType}>忘记密码</Text>
                  </View>
    //中间的文字描述
    let middleContent = <Text style={{fontSize:13,marginTop:24,color:'#343434'}}>密码长度为8-16位</Text>
    let pwdInput = <View style={styles.myInputView}>
                    <TextInput
                      style={styles.myInput}
                      onChangeText={(text)=>this.myOnChangeText(text)}
                      value={this.state.user.pwd}
                      placeholder='登陆密码'
                      placeholderTextColor='#CDCDCD'
                      secureTextEntry={this.state.secureTextEntry}
                    />
                    {inputIcon}
                  </View>
    let telInput = <View style={styles.myInputView}>
                    <TextInput
                      style={styles.myInput}
                      onChangeText={(text)=>this.myOnChangeTel(text)}
                      value={this.state.user.pwd}
                      placeholder='手机号'
                      placeholderTextColor='#CDCDCD'
                      keyboardType={'numeric'}
                    />
                  </View>
    let RegisterStepOneBtn = <TouchableOpacity
                    disabled={!this.state.status} 
                    onPress={()=>{this.myRegisterStepOneBtn()}}
                    style={styles.loginBtn}
                    activeOpacity={1}
                  >
                    <Text style={[{color:'#fff',fontSize:20},this.state.status ? {opacity:1} : {opacity:0.8}]}>确认注册</Text>
                  </TouchableOpacity>
    return (
      <View style={styles.containter}>
        {loadingSpinner}
        <NavigationBar title=''
          leftButton={this.getLeftButton(()=>this.myBack())}
          navColor='#fff'
          statusBarColor='#AAAAAA'
          statusBarStyle='light-content'/>
        {this.state.isSnackbars ? alertView : null}
        <View style={styles.content}>
          <Text style={{fontSize:26,color:'#343434'}}>欢迎登陆</Text>
          {middleContent}
          {pwdInput}
          {RegisterStepOneBtn}
        </View>  
      </View>
    )
  }
  render(){
    return (<AutoHideKeyboard 
          content={this.myrender()}
      />);
  }
}
let styles = StyleSheet.create({
  containter:{
    flex:1,
    backgroundColor:'#fff',
    paddingLeft:0,
    paddingRight:0,
    paddingTop:0,
    paddingBottom:0,
    zIndex:0,
  },
  content:{
    marginLeft:26,
    marginTop:70,
  },
  myInputView:{
    marginTop:120,
    width:(width-26*2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myInput:{
    flex:1,
    height: 40,
    padding:0,
    borderColor: '#CDCDCD', 
    borderWidth: 0,
    borderBottomWidth:1,
    color:'#343434',
    fontSize:20,
    paddingRight: 0,
  },
  myInputIcon:{
    flexDirection:'row',
    borderColor: '#CDCDCD', 
    borderWidth: 0,
    borderBottomWidth:1,
    height:40,
    paddingTop:10
  },
  contentBottom:{
    flexDirection:'row',
    marginTop:45,
    justifyContent:'center',
    // alignItems:'center'
  },
  contentBottomType:{
    color:'#2B86C9',
    fontSize:13,
  },
  myVertical:{
    borderColor:'#CDCDCD',
    borderWidth:0,
    borderLeftWidth:1,
    height:15,
    marginLeft:16,
    marginRight:16,
  },
  loginBtn:{
    backgroundColor:'#FE332F',
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    width:(width-26*2),
    height:50,
    borderRadius:50,
  }
});
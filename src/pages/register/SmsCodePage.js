import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity ,
  Image,
  TextInput,
  AsyncStorage,
  Modal,
  TouchableWithoutFeedback,  
} from 'react-native';
import {Transitioner} from 'react-navigation'
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../common/NavigationBar';
import LoadingSpinner from '../../common/LoadingSpinner';
import Snackbars from '../../common/Snackbars';
import CountDown from '../../common/CountDown';
import Utils from '../../utils/Utils';
import AutoHideKeyboard from '../../common/AutoHideKeyboard';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
var height = GlobalStyles.WINDOW_HEIGHT;
var width = GlobalStyles.WINDOW_WIDTH;
export default class SmsCodePage extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{
        tel:'',
        pwd:'',
        telShow:'',
        smsCode:'',
      },
      status:false,
      isLoading:false,
      isSnackbars:false,
      isCountDown:true,
      countDownDatetime:'',
      modalVisible: false,
      isCheckContract:{
          checked:true
      }
    }
  }
  componentWillMount(){
      this.setState({
        countDownDatetime : this.props.navigation.state.params.countDownDatetime,
        isCountDown : this.props.navigation.state.params.countDownDatetime ? true : false
      });
  }
  componentDidMount(){
    AsyncStorage.getItem('user',(error,result)=>{
        if(!error){
            if(result){
                let resUser = JSON.parse(result);
                this.setState({
                    user:resUser
                });
            }
        }
    });
  }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    myclose(){
        this.setModalVisible(!this.state.modalVisible);
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
    this.props.navigation.navigate(routeName,params)
  }
  //监听验证码输入框
  myOnChangeText(text){
    this.setState({
      user:{
        tel:this.state.user.tel,
        pwd:this.state.user.pwd,
        telShow:this.state.user.telShow,
        smsCode:text,
      },
      status:text === '' ? false : true,
      isCheckContract:this.state.isCheckContract
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
        this.goto('SetPwdPage');
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
    } 
  }
  //收不到短信
  noAccept(){
    this.setModalVisible(true);
  }
  //重新发送短信
  smsAgain(){
    let datetime = Utils.fotmatDatetime(20,'yyyy-MM-dd hh:mm:ss')
    AsyncStorage.setItem('countDownDate',datetime,(error,result)=>{
        if(!error){
            this.setState({
                isCountDown:true,
                countDownDatetime : datetime
            })
            this.setModalVisible(false);
        }
    })
  }

  onClick(data){
    this.setState({
        isCheckContract:{
            checked:!this.state.isCheckContract.checked
        }
      })
  }
  modalRender(){
      return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
        > 
        <TouchableWithoutFeedback onPress={()=>{this.myclose()}}>
            <View style={styles.modal_container} >
            <View style={styles.modal_content}>
                <TouchableOpacity style={[styles.modal_row,styles.modal_rowOfBorder]}
                 onPress={() => {this.smsAgain()}}
                >
                <Text style={styles.modal_text}>重新发送短信</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.modal_row}
                onPress={() => {this.myclose();}}>
                <Text style={styles.modal_text}>试试语音验证码</Text>
                </TouchableOpacity>
            </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
      )
  }
  myrender() {
    //提示性信息
    let alertView =<Snackbars style={{position:'absolute',marginTop:-50,width: width, height: 50, backgroundColor: '#FE332F',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize: 16,color:'#fff',marginTop:8}}>{this.snackbarsContent}</Text>
                  </Snackbars>
    //加载loading 半透明页面
    let loadingSpinner = <LoadingSpinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
    //input的icon标
    let inputIconCount = <View style={styles.myInputIcon}>
        <CountDown
            date={this.state.countDownDatetime}
            segs='秒'
            secsStyle={{color:'#cdcdcd',fontSize:14,marginRight:1}}
            secondColonStyle={{color:'#cdcdcd',fontSize:14}}
            onEnd={() => {
                this.setState({
                    isCountDown: false
                })
            }}
        />
      </View>
      let inputIconFont = <View style={styles.myInputIcon}>
        <Text style={{color:'#2B86C9',fontSize:14}} onPress={()=>this.noAccept()}>收不到短信</Text>
        </View>
    //底部 验证码登陆和忘记密码
    let myBottom = <View style={styles.contentBottom}>
                        <CheckBox
                            style={{marginTop: 0,marginRight:14}}
                            onClick={()=>{this.onClick(this.state.isCheckContract)}}
                            isChecked={this.state.isCheckContract.checked}
                            checkedImage={
                                <Image  style={{tintColor:'#2B86C9'}}
                                source={require('../../../res/images/checkbox-checked.png')}/>
                            }
                            unCheckedImage={
                                <Image style={{tintColor:'#2B86C9'}}
                                source={require('../../../res/images/checkbox.png')}/>
                            }
                        />
                      <Text style={[styles.contentBottomType,{color:'#A7A7A7'}]}>同意</Text>
                      <Text style={styles.contentBottomType}>《和信贷服务条款协议》</Text>
                  </View>
    //中间的文字描述
    let middleContent = <Text style={{fontSize:13,marginTop:24,color:'#343434'}}>验证码已发送至您的手机号{this.state.user.telShow}</Text>
    let smsCodeInput = <View style={styles.myInputView}>
                    <TextInput
                      style={styles.myInput}
                      onChangeText={(text)=>this.myOnChangeText(text)}
                      value={this.state.user.pwd}
                      placeholder='验证码'
                      placeholderTextColor='#CDCDCD'
                    />
                    {this.state.isCountDown ? inputIconCount : inputIconFont}
                  </View>
    let RegisterStepOneBtn = <TouchableOpacity
                    disabled={!this.state.status || !this.state.isCheckContract.checked} 
                    onPress={()=>{this.myRegisterStepOneBtn()}}
                    style={styles.loginBtn}
                    activeOpacity={1}
                  >
                    <Text style={[{color:'#fff',fontSize:20},this.state.status&&this.state.isCheckContract.checked ? {opacity:1} : {opacity:0.8}]}>下一步</Text>
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
          <Text style={{fontSize:26,color:'#343434'}}>输入您收到验证码</Text>
          {middleContent}
          {smsCodeInput}
          {RegisterStepOneBtn}
        </View>  
        {myBottom}
        {this.modalRender()}
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
    marginTop:19,
    marginLeft:26
    // justifyContent:'center',
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
  },
  modal_container:{
    flex:1,
    flexDirection:'row',
    alignItems:'flex-end',
    backgroundColor:'rgba(0, 0, 0, 0.2)'
  },
  modal_content:{
    flex:1,
    backgroundColor:'#fff'
  },
  modal_row:{
    height:70,
    alignItems:'center',
    justifyContent:'center'
  },
  modal_rowOfBorder:{
    borderBottomColor:'#F1F1F1',
    borderBottomWidth:1
  },
  modal_text:{
    color:'#2288D0',
  }
});
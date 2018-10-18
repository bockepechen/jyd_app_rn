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
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import { ImageStores } from '../../../res/styles/ImageStores';
import DataResponsitory from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class AddressPage extends Component {
  constructor(props) {
    super(props)
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state = {
      isLoading: false,
      linkman_name: '',
      linkman_phone: '',
      linkman_address: ''
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
      isLoading: true
    });
    let url = await '/accountSafety/contactInfo';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        if (result.return_code == '0000') {
          this.setState({
            isLoading: false,
            linkman_name: result.user_name,
            linkman_phone: result.tel_phone,
            linkman_address: result.address,
          })
        }
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        console.log(e);
        // TODO Toast提示异常
        // 关闭Loading动画
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
  }

  async updateInfo() {
    if(this.state.linkman_phone == ''){
      this.refs.toast.show('手机号不能为空');
      return false;
    }
    this.setState({
      isLoading: true
    });
    let url = await '/accountSafety/saveContact';
    global.NetReqModel.link_tel_phone = this.state.linkman_phone;
    global.NetReqModel.address = this.state.linkman_address;
    global.NetReqModel.link_real_name = this.state.linkman_name;
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if (result.return_code == '0000') {
          this.setState({
            isLoading: false,
          }, ()=>{
            this.props.navigation.goBack();
          })
        }else{
          this.refs.toast.show(result.return_msg);
        }
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        console.log(e);
        // TODO Toast提示异常
        // 关闭Loading动画
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  renderInputView() {
    let kbType = Platform.OS === 'ios' ? 'number-pad' : 'numeric';
    return (
      <View
        style={{
          position: 'absolute',
          top: scaleSize(120),
          width: GlobalStyles.WINDOW_WIDTH,
          alignItems: 'center',
        }}>
        <View style={{ width: scaleSize(1134), height: scaleSize(550), backgroundColor: '#ffffff', borderRadius: 10, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: scaleSize(81), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ color: '#998675', fontSize: scaleSize(36) }}>{'默认联系人:'}</Text>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(36), paddingTop: 0, paddingBottom: 0 }}
              clearButtonMode={'while-editing'}
              placeholder={'默认联系人'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              value={this.state.linkman_name}
              onChangeText={(linkman_name) => {
                this.setState({
                  linkman_name: linkman_name
                })
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: scaleSize(54), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ color: '#998675', fontSize: scaleSize(36) }}>{'联系电话:'}</Text>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(36), paddingTop: 0, paddingBottom: 0 }}
              maxLength={11}
              keyboardType={kbType}
              clearButtonMode={'while-editing'}
              placeholder={'联系电话'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              value={this.state.linkman_phone}
              onChangeText={(linkman_phone) => {
                this.setState({
                  linkman_phone: linkman_phone
                })
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: scaleSize(54), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ color: '#998675', fontSize: scaleSize(36) }}>{'详细地址:'}</Text>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(36), paddingTop: 0, paddingBottom: 0 }}
              clearButtonMode={'while-editing'}
              placeholder={'详细地址'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              value={this.state.linkman_address}
              onChangeText={(linkman_address) => {
                this.setState({
                  linkman_address: linkman_address
                })
              }}
            />
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{ width: scaleSize(1134), height: scaleSize(66) }} />
        <TouchableHighlight
          style={{ marginTop: scaleSize(56) }}
          underlayColor='rgba(0,0,0,0)'
          onPress={() => { this.updateInfo() }}>
          <ImageBackground
            source={ImageStores.sy_17}
            resizeMode={'stretch'}
            style={{ width: scaleSize(558), height: scaleSize(168), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'提交'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
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
              style={{ width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(456) }} />
            {this.renderInputView()}
          </View>
          {this.state.isLoading ? (<LoadingIcon isModal={true}/>) : null}
          {ViewUtils.renderToast()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
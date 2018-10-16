import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import { ImageStores } from '../../../res/styles/ImageStores';
import DataResponsitory from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class PersonInfoPage extends Component {
  constructor(props) {
    super(props)
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.state = {
      isLoading: false,
      httpRes: {},
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.getInfoData();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  async getInfoData() {
    this.setState({
      isLoading: true
    });
    let url = await '/accountSafety/userInfo';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if (result.return_code == '0000') {
          this.setState({
            isLoading: false,
            httpRes: result,
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

  navGoback = () => {
    this.props.navigation.goBack();
  }

  renderRemark() {
    return (
      <View style={{ marginTop: scaleSize(105), width: GlobalStyles.WINDOW_WIDTH, alignItems: 'center', }}>
        <View style={{ marginTop: scaleSize(66), marginLeft: scaleSize(110), marginRight: scaleSize(110) }}>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>(南昌银行已经更名为江西银行，如收不到江西银行，可选择南昌银行或者城市商业银行，开户地为江西省南昌市)</Text>
          <Text style={{ fontSize: scaleSize(36), marginTop: scaleSize(36), color: '#656565' }}>江西银行客服电话:400-78-96266</Text>
        </View>
      </View>
    )
  }

  renderInputView() {
    return (
      <View
        style={{
          marginTop: scaleSize(159),
          width: GlobalStyles.WINDOW_WIDTH,
          alignItems: 'center',
        }}>
        <View style={{ backgroundColor: '#ffffff', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'真实姓名'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.real_name ? this.state.httpRes.real_name : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'身份证号'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.card_no ? this.state.httpRes.card_no : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'电子账户'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.account_id ? this.state.httpRes.account_id : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'预留手机号'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.tel_phone ? this.state.httpRes.tel_phone : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'开户行'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.bank_name ? this.state.httpRes.bank_name : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: scaleSize(135), borderBottomWidth: scaleSize(2), borderBottomColor: '#f2f2f2', flexDirection: 'row', alignItems: "center", }}>
            <Text style={{ flex: 1, marginLeft: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>{'开户支行'}</Text>
            <Text style={{ marginRight: scaleSize(102), fontSize: scaleSize(42), color: '#989898' }}>
              {this.state.httpRes && this.state.httpRes.sub_bank_name ? this.state.httpRes.sub_bank_name : ''}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar
          title={'江西银行存管'}
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
        />
        <View>
          <ImageBackground
            source={ImageStores.dl_6}
            resizeMode={'stretch'}
            style={{ width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(456), justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={ImageStores.yh_18}
              resizeMode={'stretch'}
              style={{ width: scaleSize(558), height: scaleSize(117), marginTop: scaleSize(-100) }}
            />
          </ImageBackground>
          {this.renderInputView()}
          {this.renderRemark()}
        </View>
        {this.state.isLoading ? (<LoadingIcon />) : null}
        {ViewUtils.renderToast()}
      </View>
    )
  }
}
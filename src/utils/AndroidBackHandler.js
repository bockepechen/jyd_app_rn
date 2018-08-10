import {BackHandler} from "react-native";

export default class AndroidBackHandler {
  constructor(component) {
    this.component = component;
    this.props = component.props;
    this.lastBackPress = Date.now();
  }

  onHardwareBackPress = () => {
    // 到达路由顶点TabPage时，连续按两次back键，即为退出App
    if (this.props.navigation.state.routeName === 'TabPage') {
      if(this.lastBackPress + 2000 >= Date.now()) {
        BackHandler.exitApp();
        return false;
      } else {
        // 按下back时间间隔超过2s，即重新计时，并提示信息
        this.lastBackPress = Date.now();
        this.component.refs.toast.show('再按一次退出应用', 1500);
        return true;
      }
    } else {
      // 非路由顶点页面，进行正常后退
      this.props.navigation.goBack();
      return true;
    }
  }

  addPressBackListener(callBack) {
    if(callBack) {
      BackHandler.addEventListener('hardwareBackPress', callBack);
    } else {
      BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
    }
  }

  removePressBackListener(callBack) {
    if(callBack) {
      BackHandler.removeEventListener('hardwareBackPress', callBack);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
    }
  }
}
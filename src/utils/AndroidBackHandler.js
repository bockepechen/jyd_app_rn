import {BackHandler} from "react-native";

export default class AndroidBackHandler {
  constructor(props) {
    this.props = props;
  }
  onHardwareBackPress = () => {
    let routeKey = this.props.navigation.state.key;
    let routeIndex = routeKey.substring(routeKey.length-1);
    if (routeIndex === '0') {
      // todo
      console.log('route is already first.');
      // return true;
      return false;
    } else {
      return false;
    }
  }
  addPressBackListener() {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
  }
  removePressBackListener() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
  }
}
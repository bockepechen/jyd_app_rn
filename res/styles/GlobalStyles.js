import {
  Dimensions,
  PixelRatio,
  Platform,
  DeviceInfo,
} from 'react-native';
import {scaleSize} from '../../src/utils/FitViewUtils';

export var GlobalStyles = {
  STATUSBAR_HEIGHT: Platform.OS==='ios'?(DeviceInfo.isIPhoneX_deprecated?44:20):0,
  NAVBAR_HEIGHT: scaleSize(150),
  PARALLAX_HEADER_HEIGHT:Platform.OS==='ios'?20+40:40,
  BOTTOM_TAB_NAV_HEIGHT:scaleSize(186),
  WINDOW_WIDTH:Dimensions.get('window').width,
  WINDOW_HEIGHT:Dimensions.get('window').height,
  PIXEL_RATIO: PixelRatio.get(),
  PIXEL: 1/PixelRatio.get(),
  SCROLLVIEW_BOTTOM_HEIGHT:Platform.OS==='ios'?0:30,
  CONNECTION_TYPE: {type:'unknown', effectiveType:'unknown'},
  rootContainer: {
    flex:1,
    backgroundColor:'#F2F2F2',
  }
}
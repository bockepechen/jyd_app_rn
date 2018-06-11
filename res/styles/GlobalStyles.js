import {
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';

export var GlobalStyles = {
  STATUSBAR_HEIGHT: Platform.OS==='ios'?20:0,
  NAVBAR_HEIGHT: Platform.OS==='ios'?50:45,
  PARALLAX_HEADER_HEIGHT:Platform.OS==='ios'?20+40:40,
  WINDOW_WIDTH:Dimensions.get('window').width,
  WINDOW_HEIGHT:Dimensions.get('window').height,
  PIXEL_RATIO:PixelRatio.get(),
  rootContainer: {
    flex:1,
    backgroundColor:'#F0F0F0',
  }
}
import {
  Dimensions,
  Platform
} from 'react-native';
var Win_Width = Dimensions.get('window').width;
var Win_Height = Dimensions.get('window').height;
export var GlobalStyles = {
  STATUSBAR_HEIGHT: Platform.OS==='ios'?20:0,
  NAVBAR_HEIGHT: Platform.OS==='ios'?55:40,
  PARALLAX_HEADER_HEIGHT:Platform.OS==='ios'?20+40:40,
  WINDOW_WIDTH:Dimensions.get('window').width,
  WINDOW_HEIGHT:Dimensions.get('window').height,
  rootContainer: {
    flex:1,
    backgroundColor:'#F0F0F0',
  }
}
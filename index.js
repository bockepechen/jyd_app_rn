import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
import './src/Moidel/NetReqModel';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', 
  'Module RCTImageLoader',
  'Class RCTCxxModule was not exported.'
]);
AppRegistry.registerComponent('jyd_app_rn', () => App);

import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', 
  'Module RCTImageLoader',
  'Class RCTCxxModule was not exported.'
]);
AppRegistry.registerComponent('jyd_app_rn', () => App);

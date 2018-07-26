import {createStackNavigator, createSwitchNavigator} from 'react-navigation'
import Welcome from '../welcome/Welcome';
import TabPage from './TabPage';
import WebViewPage from '../../common/WebViewPage';
import LoanPageDetails from '../2_loan/LoanPageDetails'
import RegisterPage from '../register/RegisterPage';
import AuthPage from '../register/AuthPage';
import SetPwdPage from '../register/SetPwdPage';
import Calendar4Payback from '../4_my/Calendar4Payback';
import RotateAnimate from '../4_my/RotateAnimate';

const AppStackNavigator = createStackNavigator(
  {
    TabPage:{
      screen:TabPage,
    },
    WebViewPage:{
      screen:WebViewPage,
    },
    LoanPageDetails:{
      screen:LoanPageDetails,
    },
    RegisterPage:{
      screen:RegisterPage,
    },
    SetPwdPage:{
      screen:SetPwdPage,
    },
    Calendar4Payback:{
      screen:Calendar4Payback,
    },
    AuthPage:{
      screen:AuthPage,
    },
    RotateAnimate:{
      screen:RotateAnimate,
    },
  },{
    navigationOptions:{
      header:null
    },
  }
)

export const AppSwitchNavigator = createSwitchNavigator(
  {
    Welcome:Welcome,
    App:AppStackNavigator
  },{
    initialRouteName:'App'
  }
)
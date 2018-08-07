import {createStackNavigator, createSwitchNavigator} from 'react-navigation'
import Welcome from '../welcome/Welcome';
import TabPage from './TabPage';
import RegisterPage from '../register/RegisterPage';
import AuthPage from '../register/AuthPage';
import SetPwdPage from '../register/SetPwdPage';
import LoginPage from '../register/LoginPage';
import ResetPwdPage from '../register/ResetPwdPage';
import WebViewPage from '../../common/WebViewPage';
import LoanPageDetails from '../2_loan/LoanPageDetails'
import Calendar4Payback from '../4_my/Calendar4Payback';
import RotateAnimate from '../4_my/RotateAnimate';
import MessagePage from '../1_home/MessagePage';
import MsgListItemDetail from '../1_home/MsgListItemDetail';
import QualificationPage from '../3_discover/QualificationPage';
import SettingPage from '../4_my/SettingPage';

const AppStackNavigator = createStackNavigator(
  {
    TabPage:{
      screen:TabPage,
    },
    RegisterPage:{
      screen:RegisterPage,
    },
    SetPwdPage:{
      screen:SetPwdPage,
    },
    AuthPage:{
      screen:AuthPage,
    },
    LoginPage:{
      screen:LoginPage,
    },
    ResetPwdPage:{
      screen:ResetPwdPage,
    },
    WebViewPage:{
      screen:WebViewPage,
    },
    LoanPageDetails:{
      screen:LoanPageDetails,
    },
    Calendar4Payback:{
      screen:Calendar4Payback,
    },
    RotateAnimate:{
      screen:RotateAnimate,
    },
    MessagePage:{
      screen:MessagePage
    },
    MsgListItemDetail:{
      screen:MsgListItemDetail
    },
    QualificationPage:{
      screen:QualificationPage
    },
    SettingPage:{
      screen:SettingPage
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
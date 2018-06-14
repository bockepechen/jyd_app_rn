import {createStackNavigator, createSwitchNavigator} from 'react-navigation'
import Welcome from '../welcome/Welcome';
import TabPage from './TabPage';
import WebViewPage from '../../common/WebViewPage';
import LoanPageDetails from '../2_loan/LoanPageDetails'
import RegisterPage from '../register/RegisterPage';
import LoginPage from '../register/LoginPage';
import SmsCodePage from '../register/SmsCodePage';
import SetPwdPage from '../register/SetPwdPage';
import ForgetPwdPage from '../register/ForgetPwdPage';

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
    LoginPage:{
      screen:LoginPage,
    },
    SmsCodePage:{
      screen:SmsCodePage,
    },
    SetPwdPage:{
      screen:SetPwdPage,
    },
    ForgetPwdPage:{
      screen:ForgetPwdPage,
    },
  },{
    navigationOptions:{
      header:null
    }
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
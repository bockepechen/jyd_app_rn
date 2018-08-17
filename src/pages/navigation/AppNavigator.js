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
import JeyxListItemDetail from '../2_loan/JeyxListItemDetail';
import JxsbListItemDetail from '../2_loan/JxsbListItemDetail';
import Calendar4Payback from '../4_my/Calendar4Payback';
import RotateAnimate from '../4_my/RotateAnimate';
import MessagePage from '../1_home/MessagePage';
import MsgListItemDetail from '../1_home/MsgListItemDetail';
import SignInPage from '../1_home/SignInPage';
import HomeItemDetail from '../1_home/HomeItemDetail';
import QualificationPage from '../3_discover/QualificationPage';
import InvitingFriendsPage from '../3_discover/InvitingFriendsPage';
import InvitingRecordPage from '../3_discover/InvitingRecordPage';
import MallPage from '../3_discover/MallPage';
import ActivityPage from '../3_discover/ActivityPage';
import RedPacketPage from '../3_discover/RedPacketPage';
import OperationReportPage from '../3_discover/OperationReportPage';
import AccountPage from '../3_discover/AccountPage';
import SettingPage from '../4_my/SettingPage';
import AccountSecurityPage from '../4_my/AccountSecurityPage';
import BankCardListPage from '../4_my/BankCardListPage';
import BindCardPage from '../4_my/BindCardPage';
import AuthPhoneNumPage from '../4_my/AuthPhoneNumPage';
import AuthPhoneNumNewPage from '../4_my/AuthPhoneNumNewPage';
import AssetPage from '../4_my/AssetPage';
import AddressPage from '../4_my/AddressPage';
import ResetpwdPage from '../4_my/ResetpwdPage';
import MyLoanPage from '../4_my/MyLoanPage';


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
    AccountSecurityPage:{
      screen:AccountSecurityPage
    },
    BankCardListPage:{
      screen:BankCardListPage
    },
    BindCardPage:{
      screen:BindCardPage
    },
    AuthPhoneNumPage:{
      screen:AuthPhoneNumPage
    },
    JeyxListItemDetail:{
      screen:JeyxListItemDetail
    },
    JxsbListItemDetail:{
      screen:JxsbListItemDetail
    },
    AuthPhoneNumNewPage:{
      screen:AuthPhoneNumNewPage
    },
    AddressPage:{
      screen:AddressPage
    },
    AssetPage:{
      screen:AssetPage
    },
    ResetpwdPage:{
      screen:ResetpwdPage
    },
    MyLoanPage:{
      screen:MyLoanPage
    },
    InvitingFriendsPage:{
      screen:InvitingFriendsPage
    },
    SignInPage:{
      screen:SignInPage
    },
    MallPage:{
      screen:MallPage
    },
    InvitingRecordPage:{
      screen:InvitingRecordPage
    },
    RedPacketPage:{
      screen:RedPacketPage
    },
    HomeItemDetail:{
      screen:HomeItemDetail
    },
    ActivityPage:{
      screen:ActivityPage
    },
    OperationReportPage:{
      screen:OperationReportPage
    },
    AccountPage:{
      screen:AccountPage
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
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
import QualificationItemPage from '../3_discover/QualificationItemPage';
import InvitingFriendsPage from '../3_discover/InvitingFriendsPage';
import InvitingRecordPage from '../3_discover/InvitingRecordPage';
import MallPage from '../3_discover/MallPage';
import ActivityPage from '../3_discover/ActivityPage';
import RedPacketPage from '../3_discover/RedPacketPage';
import RedPackRulePage from '../3_discover/RedPackRulePage';
import OperationReportPage from '../3_discover/OperationReportPage';
import AccountPage from '../3_discover/AccountPage';
import SettingPage from '../4_my/SettingPage';
import AccountSecurityPage from '../4_my/AccountSecurityPage';
import BankCardListPage from '../4_my/BankCardListPage';
import BindCardPage from '../4_my/BindCardPage';
import BindCardNewPage from '../4_my/BindCardNewPage';
import AuthPhoneNumPage from '../4_my/AuthPhoneNumPage';
import AuthPhoneNumNewPage from '../4_my/AuthPhoneNumNewPage';
import AssetPage from '../4_my/AssetPage';
import AddressPage from '../4_my/AddressPage';
import ResetpwdPage from '../4_my/ResetpwdPage';
import ResetTradepwdPage from '../4_my/ResetTradepwdPage';
import MyLoanPage from '../4_my/MyLoanPage';
import FeedbackPage from '../4_my/FeedbackPage';
import PersonInfoPage from '../4_my/PersonInfoPage';
import CjzItemPage from '../4_my/CjzItemPage';
import RechargePage from '../4_my/RechargePage';
import AssetRecordPage from '../4_my/AssetRecordPage';
import RechargeBankPage from '../4_my/RechargeBankPage';
import RechargeLimitPage from '../4_my/RechargeLimitPage';
import AccountOpeningPage from '../4_my/AccountOpeningPage';
import RechargeResultPage from '../4_my/RechargeResultPage';
import AccountSetPwdPage from '../4_my/AccountSetPwdPage';
import SmsCodePage from '../4_my/SmsCodePage';
import AccountAgreementPage from '../4_my/AccountAgreementPage';
import AccountAgreementSignPage from '../4_my/AccountAgreementSignPage';


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
    FeedbackPage:{
      screen:FeedbackPage
    },
    PersonInfoPage:{
      screen:PersonInfoPage
    },
    RedPackRulePage:{
      screen:RedPackRulePage
    },
    CjzItemPage:{
      screen:CjzItemPage
    },
    RechargePage:{
      screen:RechargePage
    },
    AssetRecordPage:{
      screen:AssetRecordPage
    },
    RechargeBankPage:{
      screen:RechargeBankPage
    },
    RechargeLimitPage:{
      screen:RechargeLimitPage
    },
    AccountOpeningPage:{
      screen:AccountOpeningPage
    },
    RechargeResultPage:{
      screen:RechargeResultPage
    },
    AccountSetPwdPage:{
      screen:AccountSetPwdPage
    },
    SmsCodePage:{
      screen:SmsCodePage
    },
    ResetTradepwdPage:{
      screen:ResetTradepwdPage
    },
    AccountAgreementPage:{
      screen:AccountAgreementPage
    },
    BindCardNewPage:{
      screen:BindCardNewPage
    },
    AccountAgreementSignPage:{
      screen:AccountAgreementSignPage
    },
    QualificationItemPage:{
      screen:QualificationItemPage
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
    initialRouteName:'Welcome'
  }
)
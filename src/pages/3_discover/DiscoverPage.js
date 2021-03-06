import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import LoadingIcon from '../../common/LoadingIcon';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import CommonBlocker from '../../utils/CommonBlocker';

export default class DiscoverPage extends Component {
  constructor(props) {
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.dataResponsitory = new DataResponsitory();
    this.commonBlocker = new CommonBlocker(this);
    this.state={
      isLoading: false,
      httpRes:{},
      account_url:'',
      activity_url:'',
      audit_url:'',
      branch_url:'',
      companyAffair_url:'',
      invite_url:'',
      operationReport_url:'',
      organization_url:'',
      otherInfo_url:'',
      papers_url:'',
      permit_url:'',
      shopping_url:'',
      team_url:'',
      helpCenter_url :'',
      red_envelop_total : global.NetReqModel.red_envelop_total && global.NetReqModel.red_envelop_total != '' ? global.NetReqModel.red_envelop_total : '0.00',
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.getInfoData();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  async getInfoData() {
    this.setState({
      isLoading:true
    });
    let url = await '/discover';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      // 返回数据，关闭Loading动画
      if(result.return_code == '0000'){
        this.setState(
          {
            isLoading:false,
            httpRes : result,
            account_url:result.account_url,
            activity_url:result.activity_url,
            audit_url:result.audit_url,
            branch_url:result.branch_url,
            companyAffair_url:result.companyAffair_url,
            invite_url:result.invite_url,
            operationReport_url:result.operationReport_url,
            organization_url:result.organization_url,
            otherInfo_url:result.otherInfo_url,
            papers_url:result.papers_url,
            permit_url:result.permit_url,
            shopping_url:result.shopping_url,
            team_url:result.team_url,
            helpCenter_url :result.helpCenter_url
          }
          , () => {
            if(this.refreshing){
              this.refreshing = false;
            }
        })
      }
      else if(result.return_code == '8888'){
        this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
      }
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
    })
    .catch((e) => {
      console.log(e);
      this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
      // TODO Toast提示异常
      // 关闭Loading动画
      if(this.state.isLoading) {
        this.setState({isLoading:false});
      }
    })
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  renderSwiper() {
    let swiperViews = [];
    let swiperSourceData = [
      ImageStores.fx_ban
    ];
    swiperSourceData.map((item, index) => {
      swiperViews.push(
        <TouchableHighlight 
          key={index}
          underlayColor='rgba(0,0,0,0)' 
          onPress={()=>{
            let navData = {
              title: '银行存管',
              url: global.InitNetData.httpRes.bank_url
            };
            this.props.navigation.navigate('HomeItemDetail', {
              data: navData,
              ...this.props
            })
          }}>
          <Image 
            source={item} 
            resizeMode={'stretch'} 
            style={{
              width:GlobalStyles.WINDOW_WIDTH,
              height:scaleSize(612)
            }} />
        </TouchableHighlight>
      )
    })
    return (
      <View style={{position:'absolute', top:0, height:scaleSize(612), width:GlobalStyles.WINDOW_WIDTH}}>
        <Swiper
          horizontal={true}
          activeDotColor='#998675'
          dotColor='#b3b3b3'
          paginationStyle={{bottom:scaleSize(8)}}>
          {swiperViews}
        </Swiper>
      </View>
    )
  }

  renderActivityView() {
    return (
      <View style={{marginTop:scaleSize(84), width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(150), flexDirection:'row'}}>
        <Image
          source={ImageStores.fx_61}
          resizeMode={'stretch'}
          style={{marginLeft:scaleSize(102), width:scaleSize(150), height:scaleSize(150)}}/>
        <TouchableOpacity 
          style={{height:scaleSize(160)}}
          onPress={async () => {
            if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
              this.goto('InvitingFriendsPage');
            }
          }}
        >
          <View style={{marginLeft:scaleSize(42), width:scaleSize(333), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'邀请好友'}</Text>
            <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#656565'}}>{'邀请好友 赚取佣金'}</Text>
          </View>
        </TouchableOpacity>
        <Image
          source={ImageStores.fx_62}
          resizeMode={'stretch'}
          style={{marginLeft:scaleSize(36), width:scaleSize(150), height:scaleSize(150)}}/>
        <TouchableOpacity 
          style={{height:scaleSize(160)}}
          onPress={async () => {
            await this.commonBlocker.checkGroup({page:'RedPacketPage'});
          }}
        >
          <View style={{marginLeft:scaleSize(42), marginRight:scaleSize(112), height:scaleSize(150)}}>
            <Text style={{marginTop:scaleSize(18), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{'现金红包'}</Text>
            <Text style={{marginTop:scaleSize(21), fontSize:scaleSize(36), color:'#656565'}}>{'参与活动 获取红包'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderBonusView() {
    return (
      <View style={{marginTop:scaleSize(39), alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity
          onPress={async () => {
            await this.commonBlocker.checkGroup({page:'RedPacketPage'});
          }}
        >
          <ImageBackground
            source={ImageStores.fx_3}
            resizeMode={'stretch'}
            style={{width:scaleSize(837), height:scaleSize(297)}}>
            <View style={{marginLeft:scaleSize(231), marginTop:scaleSize(96), height:scaleSize(28)}}>
              <Text style={{fontSize:scaleSize(28), color:'#fcee21'}}>{'累计获得'}</Text>
            </View>
            <View style={{marginLeft:scaleSize(186), marginTop:scaleSize(21), height:scaleSize(69), flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{fontSize:scaleSize(40), color:'#ffffff'}}>{'￥'}</Text>
              <Text style={{fontSize:scaleSize(69), color:'#ffffff'}}>{this.state.red_envelop_total }</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    )
  }

  renderGridView() {
    let line1_views = [];
    let line2_views = [];
    let line1_data = [
      {
        img: ImageStores.fx_53,
        title: '活动专区',
        callback: () => {
          this.goto('ActivityPage',{
            url:this.state.activity_url,
            jsonObj:global.NetReqModel,
            title:'活动专区'
          })
        }
      },
      {
        img: ImageStores.fx_54,
        title: '优选商城',
        callback: () => {
          global.NetReqModel.page_number = 1
          this.goto('MallPage',{
            url:'/goods',
            jsonObj:global.NetReqModel,
            title:'优选商城'
          })
        }
      },
      {
        img: ImageStores.fx_55,
        title: '运营报告',
        callback: () => {
          this.goto('OperationReportPage',{
            url:this.state.operationReport_url,
            jsonObj:global.NetReqModel,
            title:'运营报告'
          })
        }
      },
    ];
    let line2_data = [
      {
        img: ImageStores.fx_56,
        title: '企业资质',
        callback: () => {this.goto('QualificationPage',{
          organization_url:this.state.organization_url,
          permit_url:this.state.permit_url,
          team_url:this.state.team_url,
          companyAffair_url:this.state.companyAffair_url,
          branch_url:this.state.branch_url,
          papers_url:this.state.papers_url,
          audit_url:this.state.audit_url,
          otherInfo_url:this.state.otherInfo_url,
        })}
      },
      {
        img: ImageStores.fx_57,
        title: '帮助中心',
        callback: () => {
          this.goto('OperationReportPage',{
            url:this.state.helpCenter_url,
            jsonObj:global.NetReqModel,
            title:'帮助中心'
          })
        }
      },
      {
        img: ImageStores.fx_58,
        title: '官方账号',
        callback: () => {
          this.goto('AccountPage',{
            url:this.state.account_url,
            jsonObj:global.NetReqModel,
            title:'官方账号'
          })
        }
      },
    ];

    line1_data.map((item, index) => {
      line1_views.push(
        <TouchableOpacity key={index} style={{alignItems:'center'}} onPress={item.callback}>
          <Image source={item.img} resizeMode={'stretch'} style={{width:scaleSize(138), height:scaleSize(138)}}/>
          <Text style={{marginTop:scaleSize(24), fontSize:scaleSize(36), color:'#656565'}}>{item.title}</Text>
        </TouchableOpacity>
      )
    })
    line2_data.map((item, index) => {
      line2_views.push(
        <TouchableOpacity key={index} style={{alignItems:'center'}} onPress={item.callback}>
          <Image source={item.img} resizeMode={'stretch'} style={{width:scaleSize(138), height:scaleSize(138)}}/>
          <Text style={{marginTop:scaleSize(24), fontSize:scaleSize(36), color:'#656565'}}>{item.title}</Text>
        </TouchableOpacity>
      )
    })

    return (
      <View>
        <View style={{marginTop:scaleSize(78), alignItems:'center', justifyContent:'center'}}>
          <View style={{width:scaleSize(837), flexDirection:'row', justifyContent:'space-between'}}>
            {line1_views}
          </View>
        </View>
        <View style={{marginTop:scaleSize(57), alignItems:'center', justifyContent:'center'}}>
          <View style={{width:scaleSize(837), flexDirection:'row', justifyContent:'space-between'}}>
            {line2_views}
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='发现'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'/>
        <View style={{height:scaleSize(612)}}>
          <Image
            source={ImageStores.dl_6}
            resizeMode={'stretch'}
            style={{width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(435)}}/>
          {this.renderSwiper()}
        </View>
        {this.renderActivityView()}
        {this.renderBonusView()}
        {this.renderGridView()}
        {ViewUtils.renderToast()}
        {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
      </View>
    );
  }
}

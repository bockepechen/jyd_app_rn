import React,{Component} from 'react'
import {
    View,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Image,
    Keyboard,
    ImageBackground,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';
import LoadingIcon from '../../common/LoadingIcon';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';

export default class AssetPage extends Component{
    constructor(props){
        super(props)
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.state = {
            isLoading:false,
            totalAmount:'',
            freezeAmount:'',
            sumOffsetAmount:'',
            transferContractAmount:'',
            waitRepay:'',
            sumContractAmount:'',
            sumArrivaledInterest:'',
            availBal:'',
            waitContractAmount:''
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
        let url = await '/assectDetail';
        console.log(JSON.stringify(global.NetReqModel));
        this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
        .then((result) => {
          console.log(result);
          if(result.return_code == '0000'){
            this.setState({
                isLoading:false,
                totalAmount:result.totalAmount,
                freezeAmount:result.freezeAmount,
                sumOffsetAmount:result.sumOffsetAmount,
                transferContractAmount:result.transferContractAmount,
                waitRepay:result.waitRepay,
                sumContractAmount:result.sumContractAmount,
                sumArrivaledInterest:result.sumArrivaledInterest,
                availBal:result.availBal,
                waitContractAmount:result.waitContractAmount
            })
          }
          if(this.state.isLoading) {
            this.setState({isLoading:false});
          }
        })
        .catch((e) => {
          console.log(e);
          // TODO Toast提示异常
          // 关闭Loading动画
          if(this.state.isLoading) {
            this.setState({isLoading:false});
          }
        })
      }

    navGoback = () => {
        this.props.navigation.goBack();
    }

    goto(url,JsonObj){
        this.props.navigation.navigate(url,{
          data:JsonObj ? JsonObj : {}
        });
    }

    record(){
        global.NetReqModel.page_number = '1'
        this.goto('AssetRecordPage',{
            url:'/assets/historyBalance',
            jsonObj:global.NetReqModel,
            title:'收支明细'
        })
    }
  
    //一键读取
    getRightButton(callBack) {
        return <TouchableOpacity
                style={{marginRight:scaleSize(54),}}
                onPress={callBack}>
                <View style={{flexDirection:'row'}}>
                  <Text
                      style={{color:'#fff',fontSize:scaleSize(49)}} 
                  >
                    {'收支明细'}
                  </Text>
                </View>
            </TouchableOpacity>
    }

    renderTop(){
        return (
            <View style={{marginTop:scaleSize(114),width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}>
                <View
                    style={{width:scaleSize(696),height:scaleSize(696),borderRadius:scaleSize(350),justifyContent:'center',alignItems:'center',borderColor:'#ff3a49',borderWidth:scaleSize(24)}}
                >
                    <Text style={{color:'#ff3a49',fontSize:scaleSize(64)}}>{Utils.formatMoney(this.state.totalAmount,2)}</Text>
                    <Text style={{marginTop:scaleSize(24),color:'#998675',fontSize:scaleSize(48),fontWeight:'bold'}}>总资产(元)</Text>
                </View>
            </View>
        )
    }

    renderMainView(){
        return (
            <ImageBackground
                source={ImageStores.me_4} 
                resizeMode={'stretch'}
                style={{flexDirection:'row',justifyContent:'flex-start',width:scaleSize(1242),height:scaleSize(516),marginTop:scaleSize(87)}}
            >
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',marginTop:scaleSize(90), marginLeft:scaleSize(156)}}>
                    <Text style={{fontSize:scaleSize(36),color:'#989898'}}>{'可用余额(元)'}</Text>
                    <Text style={{fontSize:scaleSize(72),color:'#998675',marginTop:scaleSize(15),height:scaleSize(72)}}>{Utils.formatMoney(this.state.availBal,2)}</Text>
                    <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(63)}}>{'冻结金额(元)'}</Text>
                    <Text style={{fontSize:scaleSize(72),color:'#998675',marginTop:scaleSize(15),height:scaleSize(72)}}>{Utils.formatMoney(this.state.freezeAmount,2)}</Text>
                </View>
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',marginTop:scaleSize(90),}}>
                    <Text style={{fontSize:scaleSize(36),color:'#989898'}}>{'代收本金(元)'}</Text>
                    <Text style={{fontSize:scaleSize(72),color:'#998675',marginTop:scaleSize(15),height:scaleSize(72)}}>{Utils.formatMoney(this.state.waitContractAmount,2)}</Text>
                    <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(63)}}>{'待收回报(元)'}</Text>
                    <Text style={{fontSize:scaleSize(72),color:'#998675',marginTop:scaleSize(15),height:scaleSize(72)}}>{Utils.formatMoney(this.state.waitRepay,2)}</Text>
                </View>
            </ImageBackground>
        )
    }

    renderSubView(){
        return (
            <View style={{backgroundColor:'#fff',marginTop:scaleSize(42)}}>
                <ScrollView 
                    scrollEnabled = {false}
                >
                    <View key={0} style={{flex:1,height:scaleSize(135),flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{marginLeft:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{'累计出借金额'}</Text>
                        <Text style={{marginRight:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{`${Utils.formatMoney(this.state.sumContractAmount,2)}元`}</Text>
                    </View>
                    <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>
                    <View key={1} style={{flex:1,height:scaleSize(135),flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{marginLeft:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{'累计已收利息'}</Text>
                        <Text style={{marginRight:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{`${Utils.formatMoney(this.state.sumArrivaledInterest,2)}元`}</Text>
                    </View>
                    <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>
                    <View key={2} style={{flex:1,height:scaleSize(135),flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{marginLeft:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{'累计获得出借奖励'}</Text>
                        <Text style={{marginRight:scaleSize(108),color:'#989898',marginTop:scaleSize(48),fontSize:scaleSize(42)}}>{`${Utils.formatMoney(this.state.sumOffsetAmount,2)}元`}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar 
                        title={'资产详情'}
                        titleColor='#FFFFFF'
                        titleSize={scaleSize(56)}
                        navColor='#E8152E'
                        statusBarColor='#E8152E'
                        statusBarStyle='light-content'
                        leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                        rightButton={this.getRightButton(()=>this.record())}
                    />
                    {this.renderTop()}
                    {this.renderMainView()}
                    {this.renderSubView()}
                    {ViewUtils.renderToast()}
                    {this.state.isLoading?(<LoadingIcon />):null}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
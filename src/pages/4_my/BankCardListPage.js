import React,{Component} from 'react'
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    TouchableHighlight
} from 'react-native'
import NavigationBar from '../../common/NavigationBar';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import LoadingIcon from '../../common/LoadingIcon';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';

export default class BankCardListPage extends Component{
    constructor(props){
        super(props)
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.dataResponsitory = new DataResponsitory();
        this.state = {
            bank_name:'',
            card_no:'',
            real_name:'',
            isLoading:false
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
        this.getInfoData();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    navGoback = () => {
        this.props.navigation.goBack();
    }

    async getInfoData() {
        this.setState({
            isLoading:true
        });
        let url = await '/accountSafety/cardInfo';
        global.NetReqModel.tel_phone =  "13821192629";
        global.NetReqModel.jyd_pubData.user_id =  "204";
        global.NetReqModel.jyd_pubData.token_id =  "123235h5e3";
        console.log(JSON.stringify(global.NetReqModel));
        this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
        .then((result) => {
            console.log(result);
            if(result.return_code == '0000'){
            this.setState({
                isLoading:false,
                bank_name:result.bank_name,
                card_no:result.card_no,
                real_name:result.real_name,
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

    unbind(){
        this.goto('UnBindCardPage',{
            url:'/unbind',
            title:'解绑银行卡',
            jsonObj:global.NetReqModel
        })
    }

    goto(url,JsonObj){
        this.props.navigation.navigate(url,{
          data:JsonObj ? JsonObj : {}
        });
    }

    _renderItem(){
        return (
            <View style={{marginTop:scaleSize(30),flexDirection:'row',justifyContent:'center'}}>
                <ImageBackground 
                    source={ImageStores.me_32}
                    resizeMode={'stretch'}
                    style={{width:scaleSize(1173), height:scaleSize(498), flexDirection:'row'}}>
                    <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start'}}>
                        <View style={{flexDirection:'row',marginTop:scaleSize(63),justifyContent:'space-between'}}>
                            <Text style={{marginLeft:scaleSize(75),color:'#fff',fontSize:scaleSize(48)}}>{this.state.bank_name}</Text>
                            <TouchableHighlight
                                onPress={()=>{this.unbind()}}
                            >
                                <ImageBackground 
                                    source={ImageStores.sy_16}
                                    resizeMode={'stretch'}
                                    style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginRight:scaleSize(69),width:scaleSize(99),height:scaleSize(48)}}
                                >
                                    <Text style={{color:'#ff3a49',fontSize:scaleSize(32)}}>{'解绑'}</Text>
                                </ImageBackground>
                            </TouchableHighlight>
                        </View>
                        <View style={{flexDirection:'row',marginTop:scaleSize(62),justifyContent:'center'}}>
                            <Text style={{fontSize:scaleSize(84),color:'#fff'}}>
                                {this.state.card_no}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',marginTop:scaleSize(115),justifyContent:'flex-end'}}>
                            <Text style={{marginRight:scaleSize(69) ,fontSize:scaleSize(36),color:'#f2f2f2'}}>
                                持卡人:{this.state.real_name}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    _renderItemAdd(){
        return (
            <View style={{marginTop:scaleSize(30),flexDirection:'row',justifyContent:'center'}}>
                <ImageBackground 
                    source={ImageStores.me_33}
                    resizeMode={'stretch'}
                    style={{width:scaleSize(1173), height:scaleSize(498), flexDirection:'row'}}>
                    <TouchableOpacity 
                        onPress={()=>{
                            global.NetReqModel.user_ip = global.NetReqModel.jyd_pubData.ip;
                            this.goto('BindCardNewPage',{
                                url:'/bindCard',
                                jsonObj:global.NetReqModel,
                                title:'绑定银行卡'
                            })
                        }}
                        style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image 
                            source={ImageStores.me_34}
                            resizeMode={'stretch'}
                            style={{width:scaleSize(162),height:scaleSize(162)}}
                        />
                        <Text style={{marginLeft:scaleSize(60),color:'#c3c3c3',fontSize:scaleSize(60),fontWeight:'bold'}}>{'添加银行卡'}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }

    renderMainView(){
        return (
            <View>
                <ScrollView 
                    style={{marginTop:scaleSize(27)}}
                    scrollEnabled = {false}
                >
                    {this.state.card_no.length > 0 ? this._renderItem() : this._renderItemAdd()}
                </ScrollView>
                <View style={{marginTop:scaleSize(126),marginLeft:scaleSize(108)}}>
                    <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{'提示'}</Text>
                    <Text style={{color:'#989898',fontSize:scaleSize(36),marginTop:scaleSize(18)}}>{'1.可用余额为0且无债权关系时可解绑银行卡'}</Text>
                    <Text style={{color:'#989898',fontSize:scaleSize(36),marginTop:scaleSize(18)}}>{'2.如有问题,请联系客服400-8780-777'}</Text>
                </View>
            </View>
        )
    }

    render(){
        return (
            <View style={GlobalStyles.rootContainer}>
                <NavigationBar 
                    title='银行卡'
                    titleColor='#FFFFFF'
                    titleSize={scaleSize(56)}
                    navColor='#E8152E'
                    statusBarColor='#E8152E'
                    statusBarStyle='light-content'
                    leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
                />
                {this.renderMainView()}
                {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
                {ViewUtils.renderToast()}
            </View>
        )
    }
}
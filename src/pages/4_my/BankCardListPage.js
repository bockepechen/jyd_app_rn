import React,{Component} from 'react'
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import {ImageStores} from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';

export default class BankCardListPage extends Component{
    constructor(props){
        super(props)
        this.AndroidBackHandler = new AndroidBackHandler(this);
        // this.listItem = [
        //     {
        //         bankName:'某某银行',
        //         cardNo:'622222224651261****',
        //         person:'史*'
        //     }
        // ]
        this.listItem = []
        this.state = {
            cardInfo:this.listItem,
        }
    }

    componentDidMount() {
        this.AndroidBackHandler.addPressBackListener();
    }

    componentWillUnmount() {
        this.AndroidBackHandler.removePressBackListener();
    }

    navGoback = () => {
        this.props.navigation.goBack();
    }

    goto(url,JsonObj){
        this.props.navigation.navigate(url,{

        });
    }

    _renderItem(){
        var itemArray = []
        this.state.cardInfo.map((item, index) => {
            itemArray.push(
                <View key={index} style={{marginTop:scaleSize(30),flexDirection:'row',justifyContent:'center'}}>
                    <ImageBackground 
                        source={ImageStores.me_32}
                        resizeMode={'stretch'}
                        style={{width:scaleSize(1173), height:scaleSize(498), flexDirection:'row'}}>
                        <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start'}}>
                            <View style={{flexDirection:'row',marginTop:scaleSize(63),justifyContent:'space-between'}}>
                                <Text style={{marginLeft:scaleSize(75),color:'#fff',fontSize:scaleSize(48)}}>{item.bankName}</Text>
                                <ImageBackground 
                                    source={ImageStores.sy_16}
                                    resizeMode={'stretch'}
                                    style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginRight:scaleSize(69),width:scaleSize(99),height:scaleSize(48)}}
                                >
                                    <Text style={{color:'#ff3a49',fontSize:scaleSize(32)}}>{'解绑'}</Text>
                                </ImageBackground>
                            </View>
                            <View style={{flexDirection:'row',marginTop:scaleSize(62),justifyContent:'center'}}>
                                <Text style={{fontSize:scaleSize(84),color:'#fff'}}>
                                    {item.cardNo}
                                </Text>
                            </View>
                            <View style={{flexDirection:'row',marginTop:scaleSize(115),justifyContent:'flex-end'}}>
                                <Text style={{marginRight:scaleSize(69) ,fontSize:scaleSize(36),color:'#f2f2f2'}}>
                                    持卡人:{item.person}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            )
        })
        return itemArray;
    }

    _renderItemAdd(){
        return (
            <View style={{marginTop:scaleSize(30),flexDirection:'row',justifyContent:'center'}}>
                <ImageBackground 
                    source={ImageStores.me_33}
                    resizeMode={'stretch'}
                    style={{width:scaleSize(1173), height:scaleSize(498), flexDirection:'row'}}>
                    <TouchableOpacity 
                        onPress={()=>{this.goto('BindCardPage')}}
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
                    {this.state.cardInfo.length > 0 ? this._renderItem() : this._renderItemAdd()}
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
            </View>
        )
    }
}
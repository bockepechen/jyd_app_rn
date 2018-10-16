import React, { Component } from 'react';
import {
    Platform,
    Text,
    View,
    TouchableHighlight,
    ImageBackground,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import { ImageStores } from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import CommonBlocker from '../../utils/CommonBlocker';
import LoadingIcon from '../../common/LoadingIcon';
import {ExceptionMsg} from '../../dao/ExceptionMsg';

export default class FeedbackPage extends Component {
    constructor(props) {
        super(props);
        this.dataResponsitory = new DataResponsitory();
        this.AndroidBackHandler = new AndroidBackHandler(this);
        this.commonBlocker = new CommonBlocker(this);
        this.state = {
            adviceLength: 0,
            isLoading: false,
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

    changeAdviceWordsCount(t) {
        this.advice = t;
        this.setState({
            adviceLength: this.advice.length,
        })
    }

    feedback = async () => {
        Keyboard.dismiss();
        if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            if (!this.advice) {
                this.refs.toast.show('请输入您的意见');
                return false;
            } 
            else if(this.state.adviceLength > 200){
                this.refs.toast.show('您已超过字数限制，请修改.');
                return false;
            }
            else {
                // 启动Loading动画
                this.setState({ isLoading: true });
                // 设置远程接口访问参数 (同步执行)
                global.NetReqModel.content = await this.advice;
                global.NetReqModel.contact_way = await this.contact_way;
                let url = await '/userOpinion';
                this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
                    .then((result) => {
                        // 返回数据，关闭Loading动画
                        this.setState({ isLoading: false }, () => {
                            if (result.return_code === '0000') {
                                this.refs.toast.show('感谢您的宝贵意见', 1000, () => {
                                    this.props.navigation.goBack();
                                });
                            } else {
                                this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
                            }
                        })
                    })
                    .catch((e) => {
                        this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
                        // 关闭Loading动画
                        if (this.state.isLoading) {
                            this.setState({ isLoading: false });
                        }
                    })
            }
        }
    }


    renderMainView() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginLeft: scaleSize(63), marginTop: scaleSize(87) }}>
                    <Text style={{ fontSize: scaleSize(42), color: '#998675' }}>{'我们的进步需要您的宝贵意见'}</Text>
                </View>
                <View style={{ width: scaleSize(1134), borderRadius: scaleSize(15), height: scaleSize(642), marginLeft: scaleSize(63), marginTop: scaleSize(39), backgroundColor: '#fff', padding: scaleSize(20) }}>
                    <TextInput
                        multiline={true}
                        maxLength={200}
                        numberOfLines={10}
                        style={{ textAlignVertical: 'top', paddingBottom: 0 }}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={(t) => { this.changeAdviceWordsCount(t) }}
                    />
                    <Text style={{ position: 'absolute', fontSize: scaleSize(36), color: '#989898', alignSelf: 'flex-end', right: scaleSize(51), bottom: scaleSize(45) }}>{`${this.state.adviceLength}/200`}</Text>
                </View>
                <View style={{ marginTop: scaleSize(99), marginLeft: scaleSize(42) }}>
                    <Text style={{ fontSize: scaleSize(42), color: '#998675' }}>{'联系方式(选填)'}</Text>
                </View>
                <View style={{ alignItems: 'center', width: scaleSize(1134), borderRadius: scaleSize(15), height: scaleSize(240), marginLeft: scaleSize(63), marginTop: scaleSize(39), backgroundColor: '#fff', padding: scaleSize(20) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: scaleSize(93), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center" }}>
                        <TextInput
                            style={{ flex: 1, marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(36), paddingTop: 0, paddingBottom: 0 }}
                            maxLength={11}
                            clearButtonMode={'while-editing'}
                            placeholder={'手机号码/邮箱/微信'}
                            placeholderTextColor='#c3c3c3'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={(t) => { this.contact_way = t; }}
                        />
                    </View>
                </View>
                <TouchableHighlight
                    style={{ flexDirection: 'row', marginTop: scaleSize(147), justifyContent: 'center' }}
                    underlayColor='rgba(0,0,0,0)'
                    onPress={this.feedback}>
                    <ImageBackground
                        source={ImageStores.sy_17}
                        resizeMode={'stretch'}
                        style={{ width: scaleSize(558), height: scaleSize(168), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'发送'}</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View style={GlobalStyles.rootContainer}>
                    <NavigationBar
                        title='意见反馈'
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
            </TouchableWithoutFeedback>
        )
    }
}
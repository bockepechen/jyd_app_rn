import React, {Component} from 'react';
import {View,
    TouchableWithoutFeedback,
    Animated,
    Easing, 
    TouchableOpacity, 
    Alert,
    StyleSheet, 
    Platform,
    Text, 
    Image,
    BackHandler,
    StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import {ImageStores} from '../../res/styles/ImageStores';
import {GlobalStyles} from '../../res/styles/GlobalStyles';
import {scaleSize} from '../utils/FitViewUtils';

const width = GlobalStyles.WINDOW_WIDTH;
const height = GlobalStyles.WINDOW_HEIGHT
const [left, top] = [0, 0];
let isAndroid = Platform.OS==='android'?true:false;
export default class ActionSheetShare extends Component {
    static propTypes = {
        shareWxToOneCallback:PropTypes.func,
        shareWxCallback:PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
            bottomSpace:0,
            maskOpacity:0.5,
            hide: true,
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
        };
    }
    componentWillMount(){
        //Cancel for Android
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', ()=>{
                if(this.state.hide){
                    return false;
                }else {
                    this._dismiss();
                    return true;
                }

            });
        }
        // 分享内容项的高度
        this.itemsPartHeight = scaleSize(400);
        // 取消按钮的高度
        this.cancelPartHeight = scaleSize(150);
        // 中间和底部间隙的高度
        this.seperatePartHeight = scaleSize(70);
        this.statusbar = isAndroid ? StatusBar.currentHeight : scaleSize(0);
        // 分享弹框的高度合计
        this.totalHeight = this.itemsPartHeight + this.cancelPartHeight + this.seperatePartHeight + this.statusbar;
        // 分享弹框的宽度
        this.contentWidth = width - 20;
    }
    componentWillUnmount() {
        this.chooseTimer && clearTimeout(this.chooseTimer);
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', ()=>{});
        }
    }
    //animation of fading
    _fade() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 100,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 100,
                    toValue: 0,
                }
            )
        ]).start(() => this.setState({hide: true}));
    }
    //dismiss ActionSheet
    _dismiss() {
        if (!this.state.hide) {
            this._fade();
        }
    }
    //animation of showing
    _appear() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 0.7,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 1,
                }
            )
        ]).start();
    }
    //select item
    _didSelect(_callback) {
        if (!this.state.hide) {
            this._fade();
            let callback = _callback;
            this.chooseTimer = setTimeout(()=>{
                if(callback){
                    {callback()}
                }
            }, 200);
        }
    }
    /*
     show ActionSheet
     */
    show() {
        if (this.state.hide) {
            this.setState({
                hide: false
            },this._appear);
        }
    }
    shareWxToOne(){
        if(this.props.shareWxToOneCallback)
            this.props.shareWxToOneCallback();
        else
            Alert.alert('分享朋友');
    }
    shareWx(){
        if(this.props.shareWxCallback)
            this.props.shareWxCallback()
        else
            Alert.alert('分享朋友圈');
    }

    _renderItem() {
        return (
            <View style={[styles.shareCommon, { height: this.itemsPartHeight, justifyContent: 'space-around' }]}>
                <View style={{ paddingLeft: 15 }}>
                    <TouchableOpacity onPress={() => this._didSelect(this.shareWx())}>
                        <Image resizeMode='contain' style={styles.image} source={ImageStores.fx_59} />
                        <Text style={styles.shareText} >微信朋友圈</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingRight: 15 }}>
                    <TouchableOpacity onPress={() => this._didSelect(this.shareWxToOne())}>
                        <Image resizeMode='contain' style={styles.image} source={ImageStores.fx_60} />
                        <Text style={styles.shareText} >微信好友</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //render cancel part
    _renderCancelItem() {
        return (
            <TouchableOpacity onPress={() => this._dismiss()} activeOpacity={0.9}>
                <View style={[styles.shareCommon, { height: this.cancelPartHeight, justifyContent: 'center' }]}>
                    <Text style={[styles.cancelText]}>取消</Text>
                </View>
            </TouchableOpacity>

        );
    }

    render() {
        if(this.state.hide)
        {
            return (<View/>)
        }
        else{
            return (
                <TouchableWithoutFeedback onPress={() => this._fade()}>
                    <View style={[styles.container]}>
                        <StatusBar />
                        <Animated.View style={[styles.maskViewStyle, { opacity: this.state.maskOpacity }]}></Animated.View>
                        <Animated.View style={[{
                            width: width,
                            height: this.totalHeight,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }, {
                            transform: [{
                                translateY: this.state.offset.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [height, height - this.totalHeight]
                                }),
                            }]
                        }]}>
                            <View style={{ flex: 1, width: this.contentWidth, height: this.totalHeight }}>
                                {this._renderItem()}
                                {this._renderCancelItem()}
                            </View>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        top: top,
    },
    //style of mask
    maskViewStyle: {
        justifyContent: "center",
        backgroundColor: "#000000",
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    shareCommon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 8
    },
    shareText: {
        fontSize: 11,
        fontWeight: '200',
        color: '#343434',
        textAlign: 'center',
    },
    cancelText: {
        fontSize: 17,
        color: '#343434',
        textAlign: 'center',
    }
});
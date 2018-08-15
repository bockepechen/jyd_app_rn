import React, {Component} from 'react';
import {View,
    TouchableWithoutFeedback,
    Animated,
    Easing, 
    TouchableOpacity, 
    Alert,
    StyleSheet, 
    Platform,
    Dimensions, 
    Text, 
    Image,
    BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import {ImageStores} from '../../res/styles/ImageStores';
import {GlobalStyles} from '../../res/styles/GlobalStyles';
import {scaleSize} from '../utils/FitViewUtils';

const width = GlobalStyles.WINDOW_WIDTH;
const height = GlobalStyles.WINDOW_HEIGHT
const [left, top] = [0, 0];
var unknowHeight = Platform.OS === 'android'? scaleSize(100) : 0;
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
        this.itemsPartHeight = scaleSize(350);
        this.cancelPartHeight = scaleSize(120);
        this.seperatePartHeight=scaleSize(3);
        // total content height
        this.totalHeight = this.itemsPartHeight + this.cancelPartHeight + this.seperatePartHeight+unknowHeight;
        this.contentWidth = width;
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
                    duration: 200,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 200,
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
            <View style={{width:this.contentWidth,height:this.itemsPartHeight}}>
                <View style={{justifyContent:'space-around',flexDirection: 'row', marginTop: 15}}>
                    <TouchableOpacity style={styles.item} onPress={() => this._didSelect(this.shareWxToOne())}>
                        <Image resizeMode='contain' style={styles.image}
                               source={ImageStores.fx_59}/>
                        <Text>微信朋友圈</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => this._didSelect(this.shareWx())}>
                        <Image resizeMode='contain' style={styles.image}
                               source={ImageStores.fx_60}/>
                        <Text>微信好友</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _renderCancelSeperateLine(show){
        if (show){
            return ( <View style={{width:this.contentWidth,height: this.seperatePartHeight, backgroundColor: '#CDCDCD'}}/>);
        }else {
            return null;
        }
    }
    //render cancel part
    _renderCancelItem(){
        return (
          <View style={{width:this.contentWidth,height:this.cancelPartHeight}}>
              {this._renderCancelSeperateLine(true)}
              {/* Cancel Item */}
                <TouchableOpacity onPress={()=>this._dismiss()} activeOpacity = {0.9}>
                    <View style={{justifyContent: 'center',alignItems: 'center',width:this.contentWidth,height:this.cancelPartHeight}}>
                        <Text style={[styles.textStyle,{fontSize:13,color:'#343434'}]}>取消</Text>
                    </View>
                </TouchableOpacity>
          </View>
        );
    }
    render() {
        if(this.state.hide)
        {
            return (<View/>)
        }
        else{
            return (
            <TouchableWithoutFeedback onPress={()=>this._fade()}>
                <View style={[styles.container]}>
                    <Animated.View style={[styles.maskViewStyle,{opacity: this.state.maskOpacity}]}></Animated.View>
                    <Animated.View style={[{
                        width: width,
                        height: this.totalHeight,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }, {
                        transform: [{
                            translateY: this.state.offset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, (height - this.totalHeight)]
                            }),
                        }]
                    }]}>
                        <View style={{backgroundColor:'#fff'}}>
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
    //style of text
    textStyle:{
        textAlign: "center",
        justifyContent: 'center',
    },

    //style of content (title & item & cancel)
    contentViewStyle:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 8
    },
});
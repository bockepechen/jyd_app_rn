import React from 'react'
import{
    View, Text
} from 'react-native'
import { ProgressCircle } from 'react-native-svg-charts';
import {GlobalStyles} from '../../../res/styles/GlobalStyles'

export default class ProgressCircleExample extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            progress:0,
            countNum:0
        }
    }
    componentDidMount() {
        let totalMoney = 35000;
        let multiple = 0;
        let flag = 0;
        this.timer = setInterval(()=>{
            flag += 0.02;
            this.setState({
                progress:this.state.progress+0.02,
                countNum:flag>=1?totalMoney:Math.floor((Math.random()+multiple)*700)
            });
            // console.log(`flag: ${flag}  multiple: ${multiple}  countNum: ${this.state.countNum}  progress: ${this.state.progress}`);
            multiple += 1;
            if (this.state.progress >= 1) {
                clearInterval(this.timer);
            }
        },20);
    }
    render() {
        

        return (
            <View style={{flex:1}}>
            <ProgressCircle
                style={ { height: 200, marginTop:50} }
                progress={ this.state.progress }
                progressColor={'rgb(134, 65, 244)'}
                startAngle={ -Math.PI * 0.8 }
                endAngle={ Math.PI * 0.8 }
                animate={true}
            />
            <View style={{
                height:50,
                backgroundColor:'rgba(0,0,0,0)',
                position:'absolute',
                top:120,
                left:GlobalStyles.WINDOW_WIDTH/2-40,
                right:GlobalStyles.WINDOW_WIDTH/2-40,
                alignItems:'center',
                justifyContent:'center'
            }}>
            <Text style={{fontSize:18}}>{this.state.countNum}</Text>
            </View>
            </View>
        )
    }

}
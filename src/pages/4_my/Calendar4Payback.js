import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import {Calendar,LocaleConfig} from 'react-native-calendars';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';

LocaleConfig.locales['fr'] = {
  monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
  dayNamesShort: ['日','一','二','三','四','五','六']
};
LocaleConfig.defaultLocale = 'fr';

export default class Calendar4Payback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
      selected:new Date().toLocaleDateString()
    }
  }

  onDayPress = (day) => {
    this.setState({
      selected: day.dateString
    });
  }

  renderExtraInfoView() {
    let views = [];
    let selectDate = new Date(this.state.selected);
    let dayName = this.getWeekDayName(selectDate.getDay());
    let dayNum = selectDate.getDate();
    let randomNum = Math.floor(Math.random()*10);
    randomNum = randomNum===0?1:randomNum;
    for(var i = 1; i <= randomNum; i++){
      views.push(
        <View key={i}>
          <View style={{
            marginLeft:5,
            marginRight:10,
            marginTop:10,
            padding:8,
            height:100,
            backgroundColor:'#FFFFFF',
            shadowColor:'gray',
            shadowOffset:{width:0.5, height:0.5},
            shadowOpacity:0.5,
            shadowRadius:2,
            elevation:2,
            borderRadius:8
          }}>
            <Text>{this.state.selected+'  '+i}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={{
        flex:1,
        flexDirection:'row',
      }}>
        <View style={{
          flexDirection:'column',
          alignItems:'center',
          width:60,
          paddingTop:20
        }}>
          <Text style={{
            marginBottom:3,
            fontSize:24,
            fontWeight:'200',
            fontStyle:'italic',
            color:'#B5B5B5'
          }}>{dayNum}</Text>
          <Text style={{
            fontSize:12,
            color:'#B5B5B5',
            fontWeight:'400',
          }}>{dayName}</Text>
        </View>
        <ScrollView style={{paddingTop:10}}>
          {views}
          <View style={{height:GlobalStyles.SCROLLVIEW_BOTTOM_HEIGHT}}/>
        </ScrollView>
      </View>
    )
  }

  getWeekDayName(day) {
    let weekDayName = '';
    switch(day) {
      case 0:
        weekDayName = '周日';
        break;
      case 1:
        weekDayName = '周一';
        break;
      case 2:
        weekDayName = '周二';
        break;
      case 3:
        weekDayName = '周三';
        break;
      case 4:
        weekDayName = '周四';
        break;
      case 5:
        weekDayName = '周五';
        break;
      case 6:
        weekDayName = '周六';
        break;
    }
    return weekDayName;
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
        title={'回款日历'}
        titleColor='#4A4A4A'
        titleSize={18}
        navColor='#FFFFFF'
        statusBarColor='#AAAAAA'
        statusBarStyle='light-content'
        leftButton={ViewUtils.renderBackBtn('#4A4A4A', this.goBack)}/>

        <Calendar style={styles.calendar}
        onDayPress={this.onDayPress}
        theme={{
          textDayFontSize: 14,
          'stylesheet.calendar.header':{
            monthText: {
              fontSize: 15,
              fontFamily: 'System',
              fontWeight: '300',
              color: '#2d4150',
              margin: 10,
            },
            dayHeader: {
              marginTop: 3,
              marginBottom: 7,
              width: 32,
              textAlign: 'center',
              fontSize: 13,
              fontFamily: 'System',
              color: '#b6c1cd',
            },
            week: {
              marginTop: 0,
              flexDirection: 'row',
              justifyContent: 'space-around'
            },
          },
          'stylesheet.day.single':{
            base: {
              width: 28,
              height: 28,
              alignItems: 'center',
            },
          },
        }}
        markingType={'custom'}
        markedDates={{
          '2018-06-01': {
            customStyles: {
              container: {
                backgroundColor: '#EED2EE',
                elevation: 6,
                shadowColor:'gray',
                shadowOffset:{width:0.5, height:0.5},
                shadowOpacity:0.5,
                shadowRadius:2,
              },
              text: {
                color: 'blue',
              },
            }
          },
          [this.state.selected]: {
            customStyles: {
              container: {
                backgroundColor: '#EE6A50',
                elevation: 6,
                shadowColor:'gray',
                shadowOffset:{width:0.5, height:0.5},
                shadowOpacity:0.5,
                shadowRadius:2,
              },
              text: {
                fontWeight:'bold'
              },
            }
          }
        }}
        monthFormat={'yyyy年MM月'}
        // hideExtraDays
        />
        {this.renderExtraInfoView()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 2,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 290,
    marginLeft:10,
    marginRight:10,
    borderRadius:8
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: 10,
    backgroundColor: '#eee',
    marginTop:50
  },
})
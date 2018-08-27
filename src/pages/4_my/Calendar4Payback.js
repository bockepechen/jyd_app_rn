import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import Utils from '../../utils/Utils';
import { ImageStores } from '../../../res/styles/ImageStores';
import DataResponsitory from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import {ExceptionMsg} from '../../dao/ExceptionMsg';

LocaleConfig.locales['fr'] = {
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
};
LocaleConfig.defaultLocale = 'fr';

const isAndroid = Platform.OS === 'android' ? true : false;
export default class Calendar4Payback extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.renderDayDatas = {};
    this.state = {
      flag: true,
      isLoading: false,
      calendarData: {},
      monthData: {
        already_refund: 0,
        should_refund: 0,
        waiting_refund: 0,
      },
      refundList: null
    }
  }

  componentDidMount() {
    this.getCalendarInfo(Utils.dateFormate(new Date(), 'yyyy-MM'));
  }

  async getCalendarInfo(month) {
    this.setState({
      isLoading:true,
      refundList: null
    });
    global.NetReqModel.tel_phone = '15222463813';
    global.NetReqModel.current_month = month;
    global.NetReqModel.jyd_pubData.user_id = '215';
    let url = await '/refundCalendar';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        this.setState({
          isLoading:false
        }, () => {
          if(result.return_code === '0000') {
            this.resp_data = result;
            this.resp_data.refund_day_info.forEach((item) => {
              this.renderDayDatas[item.date] = {
                customStyles: {
                  container: {
                    backgroundColor: item.ifRefund ? '#989898' : '#ff3a49',
                    elevation: 6,
                    shadowColor: 'gray',
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                  },
                  text: {
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }
              }
            });
            this.renderDayDatas = JSON.parse(JSON.stringify(this.renderDayDatas));
            this.setState({
              calendarData: this.renderDayDatas,
              monthData: this.resp_data.refund_month_info,
            })
          } else {
            this.refs.toast.show(result.return_msg);
          }
        })
      })
      .catch((e) => {
        console.log(e);
        // 关闭Loading动画
        if(this.state.isLoading) {
          this.setState({isLoading:false});
        }
        this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
      })
  }

  onDayPress = (day) => {
    // console.log('================ 初始化数据 ================');
    // console.log(this.renderDayDatas);
    // 赋值一个新对象，使深比较不同，触发页面重新渲染
    let addSelectedDay = JSON.parse(JSON.stringify(this.renderDayDatas));
    // 添加选择日期对象
    addSelectedDay[day.dateString] = {
      customStyles: {
        container: {
          backgroundColor: '#998675',
          elevation: 6,
          shadowColor: 'gray',
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        },
        text: {
          color: 'white',
          fontWeight: 'bold'
        }
      }
    }
    // console.log('================ 添加选择日期后的数据 ================');
    // console.log(addSelectedDay);
    // console.log(`渲染数据对比：${addSelectedDay === this.state.calendarData}`);
    let refundList = this.resp_data.load_record_list[day.dateString];
    if (refundList === undefined) {
      refundList = [];
    }
    console.log(refundList);
    this.setState({
      selected: day.dateString,
      calendarData: addSelectedDay,
      refundList: refundList
    })
  }

  onMonthChange = (month) => {
    this.getCalendarInfo(month.dateString.substring(0,7));
  }

  renderCalendar() {
    return (
      <Calendar
        style={styles.calendar}
        onDayPress={this.onDayPress}
        onMonthChange={this.onMonthChange}
        theme={{
          // 日历天数字号
          textDayFontSize: 14,
          calendarBackground: '#f2f2f2',
          dayTextColor: '#998675',
          arrowColor: '#998675',
          todayTextColor: '#ff3a49',
          'stylesheet.calendar.header': {
            // 头部[xxxx年xx月]样式
            monthText: {
              fontSize: 15,
              fontFamily: 'System',
              fontWeight: '300',
              color: '#2d4150',
              margin: 10,
            },
            // 头部[星期]样式容器
            week: {
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
            // 头部[星期天数]样式
            dayHeader: {
              marginTop: 3,
              marginBottom: 7,
              width: 32,
              textAlign: 'center',
              fontSize: 13,
              fontFamily: 'System',
              color: '#b6c1cd',
            },
          },
          // 日历天数样式
          'stylesheet.day.single': {
            base: {
              width: 28,
              height: 28,
              alignItems: 'center',
            },
          },
        }}
        markingType={'custom'}
        markedDates={this.state.calendarData}
        monthFormat={'yyyy年MM月'}
        hideExtraDays={true}
      />
    )
  }

  renderGraphicalView() {
    return (
      <View style={{ marginTop: scaleSize(30), width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(36), alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: scaleSize(33), height: scaleSize(33), backgroundColor: '#989898', borderRadius: scaleSize(33) }} />
          <Text style={{ marginLeft: scaleSize(21), fontSize: scaleSize(36), color: '#989898' }}>{'已还款'}</Text>
          <View style={{ marginLeft: scaleSize(21), width: scaleSize(33), height: scaleSize(33), backgroundColor: '#ff3a49', borderRadius: scaleSize(33) }} />
          <Text style={{ marginLeft: scaleSize(21), fontSize: scaleSize(36), color: '#989898' }}>{'待还款'}</Text>
        </View>
      </View>
    )
  }

  renderMonthInfo() {
    return (
      <View style={{ marginTop: scaleSize(81), width: GlobalStyles.WINDOW_WIDTH, alignItems: 'center', borderWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={{ width: scaleSize(363), alignItems: 'center', borderRightWidth: 1, borderRightColor: '#c7b229' }}>
            <Text style={{ fontSize: scaleSize(36), color: '#656565' }}>{'本月应回'}</Text>
            <Text style={{ marginTop: scaleSize(30), fontSize: scaleSize(48), color: '#998675' }}>{this.state.monthData.should_refund.toFixed(2)}</Text>
          </View>
          <View style={{ width: scaleSize(363), alignItems: 'center', borderRightWidth: 1, borderRightColor: '#c7b229' }}>
            <Text style={{ fontSize: scaleSize(36), color: '#656565' }}>{'本月已回'}</Text>
            <Text style={{ marginTop: scaleSize(30), fontSize: scaleSize(48), color: '#998675' }}>{this.state.monthData.already_refund.toFixed(2)}</Text>
          </View>
          <View style={{ width: scaleSize(363), alignItems: 'center' }}>
            <Text style={{ fontSize: scaleSize(36), color: '#656565' }}>{'本月待收'}</Text>
            <Text style={{ marginTop: scaleSize(30), fontSize: scaleSize(48), color: '#998675' }}>{this.state.monthData.waiting_refund.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderExtraInfoView() {
    let selectDate = new Date(this.state.selected);
    let dayNum = selectDate.getDate();

    let refundDetailViews = [];
    if (this.state.refundList.length > 0) {
      this.state.refundList.forEach((item, index) => {
        refundDetailViews.push(
          <ImageBackground
            key={index}
            source={ImageStores.me_27}
            resizeMode={'stretch'}
            style={{ width: scaleSize(999), height: scaleSize(324) }}>
            <View style={{ marginLeft: scaleSize(72), marginTop: scaleSize(57), height: scaleSize(48), flexDirection: 'row', alignItems: 'flex-end' }}>
              <View style={{ height: scaleSize(48) }}>
                <Text style={{ fontSize: scaleSize(48), color: '#656565', fontWeight: 'bold' }}>{item.sellName}</Text>
              </View>
              <View style={{ height: scaleSize(36) }}>
                <Text style={{ marginLeft: scaleSize(57), fontSize: scaleSize(36), color: '#998675' }}>{item.sellId}</Text>
              </View>
            </View>
            <View style={{ marginLeft: scaleSize(72), marginTop: isAndroid ? scaleSize(48) : scaleSize(57), height: scaleSize(99), flexDirection: 'row', alignItems: 'flex-end' }}>
              <View style={{ width: scaleSize(306), height: scaleSize(99) }}>
                <View style={{ height: scaleSize(48) }}>
                  <Text style={{ fontSize: scaleSize(48), color: '#998675' }}>{item.contractAmount.toFixed(2)}</Text>
                </View>
                <View style={{ marginTop: scaleSize(15), height: scaleSize(36) }}>
                  <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>{'出借金额(元)'}</Text>
                </View>
              </View>
              <View style={{ marginLeft: scaleSize(48), width: scaleSize(267), height: scaleSize(99) }}>
                <View style={{ height: scaleSize(48) }}>
                  <Text style={{ fontSize: scaleSize(48), color: '#998675' }}>{item.expectProfit.toFixed(2)}</Text>
                </View>
                <View style={{ marginTop: scaleSize(15), height: scaleSize(36) }}>
                  <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>{'预期利息(元)'}</Text>
                </View>
              </View>
              <View style={{ marginLeft: scaleSize(18), width: scaleSize(246), height: scaleSize(99) }}>
                <View style={{ height: scaleSize(48) }}>
                  <Text style={{ fontSize: scaleSize(48), color: '#ff3a49' }}>{item.offsetAmount.toFixed(2)}</Text>
                </View>
                <View style={{ marginTop: scaleSize(15), height: scaleSize(36) }}>
                  <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>{'出借奖励(元)'}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )
      })
    } else {
      refundDetailViews.push(
        <ImageBackground
          key={'noData'}
          source={ImageStores.me_27}
          resizeMode={'stretch'}
          style={{ width: scaleSize(999), height: scaleSize(324), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>{'您当日没有回款计划，请立即出借吧'}</Text>
        </ImageBackground>
      )
    }

    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: scaleSize(48), borderWidth: 0 }}>
        <View style={{ marginTop: scaleSize(36), marginLeft: scaleSize(63), flexDirection: 'column', alignItems: 'center', borderWidth: 0 }}>
          <View style={{ width: scaleSize(102), height: scaleSize(102), borderRadius: scaleSize(102), backgroundColor: '#989898', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: scaleSize(48), color: '#ffffff', fontWeight: '900' }}>
              {dayNum}
            </Text>
          </View>
          <Text style={{ marginTop: scaleSize(12), fontSize: scaleSize(36), color: '#989898' }}>
            {'2018.08'}
          </Text>
        </View>
        <View style={{ marginTop: scaleSize(15), marginLeft: scaleSize(30), borderWidth: 0 }}>
          {refundDetailViews}
          <View style={{ height: GlobalStyles.SCROLLVIEW_BOTTOM_HEIGHT }} />
        </View>
      </View>
    )
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar
          title={'回款日历'}
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)} />
        <ScrollView>
          {this.renderCalendar()}
          {this.renderGraphicalView()}
          {this.renderMonthInfo()}
          {this.state.refundList===null ? null : this.renderExtraInfoView()}
        </ScrollView>
        {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
        {ViewUtils.renderToast()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  calendar: {
    paddingTop: 2,
    height: 330,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 8
  },
})
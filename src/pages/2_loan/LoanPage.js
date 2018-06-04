import React, { PureComponent } from 'react';
import {
  Text,
  View,
  FlatList,
  Platform,
  StyleSheet,
  RefreshControl
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import FlatListCell from '../../common/FlatListCell';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';

const CITY_NAMES = ['北京','上海','广州','天津','深圳','杭州','苏州','成都','武汉','西安','重庆','济南','无锡'];

export default class LoanPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceData: [],
      selected: new Map(),
      isRefresh: false
    }
  }

  componentDidMount() {
    this.setState({
      sourceData:CITY_NAMES
    })
  }

  renderFlatListItem = (data) => {
    return (
      <FlatListCell 
      id={data.index}
      data={data}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(data.index)}
      {...this.props}/>
    )
  }

  _onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    });
  };

  keyExtractor = (data, index) => {return String(index);}

  loadData = () => {
    this.setState({isRefresh:true});
    setTimeout(() => {
      // simulate data request
      this.setState({isRefresh:false});
    }, 2000);
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar 
          title='智能出借'
          titleColor='#4A4A4A'
          navColor='#FFFFFF'
          statusBarColor='#AAAAAA'
          statusBarStyle='light-content'/>
        <FlatList 
          data={this.state.sourceData}
          extraData={this.state.selected}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderFlatListItem}
          initialNumToRender={6}
          refreshControl={
            <RefreshControl 
              title={'加载中...'}
              colors={['red']}
              tintColor={'red'}
              titleColor={'red'}
              refreshing={this.state.isRefresh}
              onRefresh={this.loadData} />
          }/>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  
})
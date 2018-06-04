import {createStackNavigator, createSwitchNavigator} from 'react-navigation'
import Welcome from '../welcome/Welcome';
import TabPage from './TabPage';

const AppStackNavigator = createStackNavigator(
  {
    TabPage:{
      screen:TabPage,
    }
  },{
    navigationOptions:{
      header:null
    }
  }
)

export const AppSwitchNavigator = createSwitchNavigator(
  {
    Welcome:Welcome,
    App:AppStackNavigator
  },{
    initialRouteName:'App'
  }
)
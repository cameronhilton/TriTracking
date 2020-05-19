import 'react-native-gesture-handler'
import React from 'react'
import { Platform, SafeAreaView, StatusBar, View } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import AddEntry from './components/AddEntry'
import EntryDetail from './components/EntryDetail'
import History from './components/History'
import Live from './components/Live'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props}/>
    </View>
  )
}

const RouteConfigs = {
  History: {
    name: 'History',
    component: History,
    options: {
      tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />,
      title: 'History'
    }
  }, 
  AddEntry: {
    component: AddEntry,
    name: 'Add Entry',
    options: {
      tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />,
      title: 'Add Entry'
    }
  },
  Live: {
    component: Live,
    name: 'Live',
    options: {
      tabBarIcon: ({tintColor}) => <FontAwesome name='tachometer' size={30} color={tintColor} />,
      title: 'Live'
    }
  }
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null,
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
    }
  }
}

const Tab = Platform.OS === 'ios'
  ? createBottomTabNavigator() 
  : createMaterialTopTabNavigator()

const TabNav = () => (
  <Tab.Navigator {...TabNavigatorConfig}>
    <Tab.Screen {...RouteConfigs['History']} />
    <Tab.Screen {...RouteConfigs['AddEntry']} />
    <Tab.Screen {...RouteConfigs['Live']} />
  </Tab.Navigator>
)

const StackNavigatorConfig = {
  headerMode: 'screen',
}

const StackConfig = {
  TabNav: {
    name: 'Home',
    component: TabNav,
    options: { headerShown: false },
  }, 
  EntryDetail: {
    name: 'EntryDetail',
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      },
      title: 'Entry Detail',
    },
  }
}

const Stack = createStackNavigator();

const MainNav = () => (
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig['TabNav']}/>
    <Stack.Screen {...StackConfig['EntryDetail']}/>
  </Stack.Navigator>
)

export default class App extends React.Component {
  render() {
    const store = createStore(reducer)
    return (
      <Provider store={store}>
        <UdaciStatusBar backgroundColor={purple} barStyle='light-content'/>
        <SafeAreaView style={{flex: 1}}>
          <NavigationContainer>
            <MainNav/>
          </NavigationContainer>
        </SafeAreaView>
      </Provider>    
    )
  }
}

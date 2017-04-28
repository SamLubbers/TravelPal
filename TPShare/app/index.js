// app/index.js

/* By Mollie Coleman
 * Referencing:
 *            For the textbox input:
 *              - https://facebook.github.io/react-native/releases/0.23/docs/textinput.html
 *            For the sharing of code 1:
 *              - http://makeitopen.com/tutorials/building-the-f8-app/design/
 *            For the sharing of code 2 - Main one used:
 *              - https://differential.com/insights/sharing-code-between-android-and-ios-in-react-native/
 *            For the navigation:
 *              - http://blog.paracode.com/2016/01/05/routing-and-navigation-in-react-native/
 * 
 * This is where all the navigation occurs between the pages. 
 */


import React, { Component } from 'react';
import {Navigator, Text, TouchableHighlight,View, AppRegistry, StyleSheet,
        Image, Button, TextInput, Dimensions, TouchableOpacity} from 'react-native';

import Start            from './Start';
import SignIn           from './SignIn';
import Home             from './Home';
import Account          from './Account';
import AddHoliday       from './AddHoliday';
import HolidayLength    from './HolidayLength';
import Friends          from './Friends';
import AddFriend        from './AddFriend';
import TripView         from './TripView';
import AddFriendToGroup from './AddFriendToGroup';
import DocumentView     from './DocumentView';
import AddDocument      from './AddDocument';


//Thanks to the sharing of code 2
export default class Index extends Component{
	renderScene(route, navigator){
      switch (route.title) {
            case "Start":
              return <Start navigator = {navigator} />
            case "SignIn":
              return <SignIn navigator = {navigator} />
            case "creatingAccount":
              return <Account navigator = {navigator} />
            case "homePage":
              return <Home navigator = {navigator} />
            case "addHoliday":
                return <AddHoliday navigator = {navigator} reRender={route.reRender}/>
            case "addingDate":
                return <HolidayLength navigator = {navigator} />
            case "holidayInfo":
                return <HolidayInfo navigator = {navigator} />
            case "Friends":
                return <Friends navigator = {navigator} />
            case "AddFriend":
                return <AddFriend navigator = {navigator} reRender={route.reRender}/>
            case "TripView":
                return <TripView navigator = {navigator} />
            case "AddFriendToGroup":
                return <AddFriendToGroup navigator = {navigator} />
            case "DocumentView":
                return <DocumentView navigator = {navigator} reRender={route.reRender}/>
            case "AddDocument":
                return <AddDocument navigator = {navigator} reRender={route.reRender}/>
      }
}
	//configureScene determines the transition animation for different components
configureScene(route, routeStack){
	if(route.title == 'addHoliday' || route.title == 'AddFriend' || route.title == 'AddDocument'){
		return Navigator.SceneConfigs.FloatFromBottom;
	}
 return Navigator.SceneConfigs.PushFromRight;
}
  render() {
    return (
      <Navigator
				style={{flex: 1}}
				initialRoute={{ title: 'SignIn' }}
        renderScene={ this.renderScene }
				configureScene={ this.configureScene }
      />
    );
  }
}

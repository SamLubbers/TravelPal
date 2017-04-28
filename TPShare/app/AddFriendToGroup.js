/*
* File describes a gui to add a friend to a group
*
* Expects the server_comms socket object to have .trip_id and .trip_name
* fields set to the id and name of the trip to add a friend too.
*
* By Rob Cobb | Bath University
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, View, ListView, TouchableOpacity, TouchableHighlight, Alert, StatusBar, StyleSheet} from 'react-native';
import Hr from 'react-native-hr';

import FriendToGroupRow from "./FriendToGroupRow";

//import server comms
var server_comms = require("../server-comms");

/*
 * This class creates the GUI for the add friend to a trip section, it has the 
 * add friend icon of the page where the user presses and this then leads them
 * to the option to add the friend to the trip. This is where the user selects
 * the friend that they have in their list to any of the trips, this is then 
 * sent to the server and the trip is then added to the intivtees trips list. 
 */
export default class AddFriendToGroup extends Component {

    _handleBackPress() {
      this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }


    constructor(props) {
        super(props);

        //needed for list view
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        //get comms, register callbacks
        this.socket = server_comms.getSock();
        this.socket.register_friend_callback(this);
        this.socket.register_friend_to_group_callback(this);

        this.state = {
            trip_id : this.socket.trip_id,
            name    : this.socket.trip_name,
            friends : this.ds.cloneWithRows([])
        };

        //send requests to server
        this.socket.see_friends();
    }

    /*
    * Renders a simple showing the trip name and id
    * As well as button to view the tip in more detail
    */
	render() {
        return (
		    <View style={styles.container}>
			    <StatusBar barStyle="light-content"/>
			        <View style={styles.topBar}>
					    <TouchableOpacity onPress={this.goBack.bind(this)}>
						    <Icon name="chevron-left" size={20} color='white'/>
						</TouchableOpacity>
						<Text style={styles.title}>
							Invite Friends
						</Text>
						<Icon name="chevron-right" size={20} color='#1B9AF7'/>
					</View>
				    <View style = {{alignItems: 'center'}}>
					    <Text style = {styles.activitiesTitle} >
						    Invite Friends to your trip to {this.state.name}
						</Text>
					</View>
					<Hr lineColor="#aaa"/>
					<ListView
				        enableEmptySections={true}
						dataSource={this.state.friends}
						renderRow={(data) => <FriendToGroupRow name = {data} />}
					/>
            </View>
        );
	}

    /*
    * Navigates to the home page
    */
    goBack() {
        this.props.navigator.pop();
    }

    /*
    * Callback function, called when a friends list is recieved
    * Adds the friends to the gui
    */
    friends_succ(list) {
        this.setState({friends : this.state.friends.cloneWithRows(list)});
    }

    /*
    * Callback function, called when a friends list retrevial failed
    * Alerts the user to the error
    */
    friends_fail(reason) {

        errorMsg = '';

        switch(reason) {
            case 'INTERNAL_SERVER_ERROR':
                errorMsg = 'Internal server error';
                break;
            case 'NOT_LOGGED_IN':
                errorMsg = 'Client Error? - Not logged in';
                break;
            default:
                errorMsg = 'Unknown error - ' + reason;
        }
        Alert.alert("Could not retreive friends list",errorMsg);
    }

    add_friend_to_group_succ(friend) {
        Alert.alert("Friend Added",friend + " was invited to the trip.");
    }

    add_friend_to_group_fail(reason) {
        Alert.alert("Friend Not Added",reason);
    }
}

/*
 * These are the styles that are used for each of the elements, this 
 * is used to create the layout, top bar and headers. 
 */ 
const styles = StyleSheet.create({
container: {
	flex: 1,
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'stretch',
	backgroundColor: 'white'
},
topBar: {
	padding: 16,
	paddingTop: 28,
	paddingBottom: 8,
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	backgroundColor: '#1B9AF7'
},
title:{
	color: 'white',
	fontSize: 20
},
activitiesTitle:{
	fontSize: 20,
	margin: 10,
	color: 'black'
}
});

/*
* File describes a GUI for adding a friend in the TravelPal system
* 
* This is the page that contains the adding a friend functionality 
* as well as the GUI implementation. A user is able to add a friends
* username and this is sent to the server where it is then forwarded
* as a pending request to the recipient. 
*
* By Rob Cobb (rbc31) | University of Bath
* By Sam Lubbers | University of Bath
* By Mollie Coleman | University of Bath
* 
*/

/*
 * These are the imports that allow elements of the GUI and system to 
 * work accordingly. For specific elements, we had to import them from
 * specific files with node_modules.
 */ 
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, TextInput, View, Alert, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';


//import socket comms for server communication
var server_comms = require("../server-comms");

/* 
 * This 
 */ 
export default class AddFriend extends Component {

    _handleBackPress() {
        this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }

    constructor(props) {
        super(props);

        //get socket and register callback
        this.socket = server_comms.getSock();
		this.socket.register_add_friends_callback(this);

		this.state = {
            username: ""
        };
    }

    /*
    * Creates GUI for adding friends with a text box, where the user has to input 
    * the name of the user that they want to add as a friend. There is also a button
    * to submit the request. 
    */
    render() {
        return (
		    <View style={styles.container}>
			    <StatusBar barStyle="light-content"/>
				    <View style={styles.topBar}>
					    <TouchableOpacity onPress={this.goToFriends.bind(this)}>
			                <Icon name="chevron-left" size={20} color='white'/>
						</TouchableOpacity>
					    <Text style={styles.title}>
						    New Friend
						</Text>
					    <Icon name="chevron-right" size={20} color='#1B9AF7'/>
					</View>
	                <Text style={styles.welcome}>
	                    Add a friend by username
	                </Text>
					<View style={styles.field}>
                        <TextInput
						    style = { styles.textInput }
                            onChangeText = { (username) => this.setState({ username }) }
                            placeholder = "username"
                            autoCapitalize = "none"
                    />
					</View>
					<View style={styles.tripButtonContainer}>
				        <TouchableOpacity onPress={this.addFriend.bind(this)}>
						    <Text style={styles.buttonTrip}>
							    Add Friend
							</Text>
						</TouchableOpacity>
					</View>
            </View>
        );
    }

    /*
    * Navigates back to the Friends gui
    */
    goToFriends() {
				this.props.reRender();
        this.props.navigator.pop();
    }

    /*
    * Attempts to add the given friend.
    */
		addFriend() {
			this.socket.add_friend(this.state.username);
		}

    /*
    * Callback function, called when friend succesfuly added.
    * Alerts user and navigates to Friends page
    */
	add_friend_succ(username) {
		Alert.alert("Friend added","Request sent");
        this.goToFriends();
	}

    /*
    * Callback function, called when friend adding failed
    * Alerts user to error
    */
	add_friend_fail(reason) {
		Alert.alert("Friend not added",reason);
	}
}

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
	field: {
		padding: 5,
		paddingLeft: 10,
		margin: 10,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderWidth: 2,
		borderRadius: 10,
		borderColor: '#1B9AF7',
		backgroundColor: 'white',
	},
	textInput:{
		height: 26
	},
	tripButtonContainer:{
		padding:20,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	buttonTrip:{
		fontSize: 30,
		marginBottom: -30,
		color: '#1B9AF7',
		height: 40,
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		marginTop: 200,
		marginBottom: 30,
		color: 'black',
	}
});

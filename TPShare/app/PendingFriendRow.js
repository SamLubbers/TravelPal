/* By Robert Cobb (rbc31)
 *
 * This just deals with the layout of the pending friend requests.
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, TouchableHighlight, View, AppRegistry, StyleSheet,
        Image, Button, TextInput, Dimensions, ListView, TouchableOpacity,Alert} from 'react-native';

//import socket.io
var server_comms = require("../server-comms");

export default class PendingFriendRow extends Component {
    _handleBackPress() {
      this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }

    constructor(props) {
        super(props);
		console.log(props.name);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.socket = server_comms.getSock();
    }

	render() {
        return(
						<View style = {styles.container}>
							<Text>
								{this.props.name}
							</Text>
							<TouchableOpacity onPress ={this.acceptRequest.bind(this)} >
							<Icon name="check" size={20} color='#1B9AF7'/>
							</TouchableOpacity>
							<TouchableOpacity onPress ={this.IgnoreRequest.bind(this)} >
							<Icon name="x" size={20} color='#EF3125'/>
							</TouchableOpacity>
						</View>
		);
	}

	acceptRequest() {
		this.socket.accept_friend(this.props.name);
	}

	IgnoreRequest() {
		this.socket.ignore_friend(this.props.name);
	}

}

/*
 *  This is used to create all the layout and formatting of the components
 *  on the page.
 */
 const styles = StyleSheet.create({
 	container:{
 	padding: 16,
 	borderTopWidth: 1,
 	borderBottomWidth: 1,
 	marginBottom: -1,
 	borderColor: '#ccc',
 	flexDirection: 'row',
 	justifyContent: 'space-between',
 	alignItems: 'center'
 	}
 });

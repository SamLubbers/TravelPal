/*
* File describes a component for showing friends in a list box with
* a button to add them to a group
*
*
* By Rob Cobb (rbc31) | Bath University
*
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

//import server communication logic
var server_comms = require("../server-comms");

export default class FriendToGroupRow extends Component {

    _handleBackPress() {
      this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }

    constructor(props) {
        super(props);

        this.socket = server_comms.getSock();

		this.state = { trip_id : this.socket.trip_id}
    }

    /*
    * Renders simple gui for seeing a friend in a list view, as well a add to group button
    * to add a friend to a group
    */
	render() {
        return(
					<TouchableOpacity onPress ={this.inviteOnTrip.bind(this)} >
						<View style = {styles.container}>
							<Text>
								{this.props.name}
							</Text>
							<Icon name="link-external" size={20} color='#1B9AF7'/>
						</View>
					</TouchableOpacity>
		);
	}

    /*
    * Sends a delete request to the server
    */
	inviteOnTrip() {
		this.socket.add_friend_to_group(this.props.name, this.socket.trip_id);
    }
}

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

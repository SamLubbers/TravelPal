/*
* File describes a component for showing friends in
* a list box with a delete button to delete friends.
*
* By Rob Cobb (rbc31) | Bath University
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text,View, AppRegistry, StyleSheet,
        Image, TextInput, Dimensions, ListView, TouchableOpacity,Alert} from 'react-native';

//import server communication logic
var server_comms = require("../server-comms");

export default class FriendRow extends Component {

    _handleBackPress() {
      this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }

    constructor(props) {
        super(props);

        this.socket = server_comms.getSock();
    }

    /*
    * Renders simple gui for seeing a friend in a list view, as well a delete button
    * to delete a friend.
    */
	render() {
        return(
		    <TouchableOpacity onPress ={this.deleteFriend.bind(this)} >
                <View style = {styles.container}>
				    <Text>
		                {this.props.name}
					</Text>
					<Icon name="trashcan" size={20} color='#EF3125'/>
				</View>
            </TouchableOpacity>
		);
	}

    /*
    * Sends a delete request to the server
    */
	deleteFriend() {
		this.socket.delete_friend(this.props.name);
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

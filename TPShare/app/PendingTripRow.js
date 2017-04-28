/*
* File describes a GUI for viewing pending trips, with an option to accept
* an invitation.
*
*  by Rob Cobb (rbc31) | Bath University
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

//import socket.io
var server_comms = require("../server-comms");

/*
 * This is the code for the GUI to ensure that the pending trips section
 * is formatted nicely and the same as friends and trips to keep the app
 * consistent. 
 */
export default class PendingTripRow extends Component {

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
    * Simple component that lists the name of the trip and provides a button
    * to open the trip
    */
	render() {
		var renderTrips = () =>{
			var tripName = this.props.name.split('(')[0];
			return tripName;
		}
        return(
					<TouchableOpacity onPress ={this.acceptInvite.bind(this)} >
						<View style = {styles.tripContainer}>
							<Text>
								{renderTrips()}
							</Text>
							<Icon name="check" size={20} color='#1B9AF7'/>
						</View>
					</TouchableOpacity>
		);
	}

    /**
    * Puts the trip name and id in the props and calls the TripView
    * to open the trip in a seperate page.
    */
	acceptInvite() {
        this.socket.trip = this.props.name;
        var inBrackets  = this.props.name.substring
                (this.props.name.indexOf('(')+1,this.props.name.indexOf(')'));

        var beforeBrackets = this.props.name.substring
                (0,this.props.name.indexOf('('));

        this.socket.accept_group_request(inBrackets);
	}

}

/*
 *
 */
const styles = StyleSheet.create({
	tripContainer:{
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

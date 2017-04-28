/*
* Component for rendering a trip in a list box.
* Component expects trip name in the format <trip name>(<trip id>)
* in the props.name variable.
*
*
* By Robert Cobb (rbc31)
*
*/

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

//import socket.io
var server_comms = require("../server-comms");

export default class TripRow extends Component {

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
		    <TouchableOpacity onPress ={this.trip.bind(this)} >
	            <View style = {styles.tripContainer}>
		            <Text>
		                {renderTrips()}
					</Text>
					<Icon name="chevron-right" size={20} color='#1B9AF7'/>
				</View>
			</TouchableOpacity>
		);
	}

    /**
    * Puts the trip name and id in the props and calls the TripView
    * to open the trip in a seperate page.
    */
	trip() {
        this.socket.trip = this.props.name;
        var inBrackets  = this.props.name.substring
                (this.props.name.indexOf('(')+1,this.props.name.indexOf(')'));

        var beforeBrackets = this.props.name.substring
                (0,this.props.name.indexOf('('));

        this.socket.trip_id = inBrackets;
        this.socket.trip_name = beforeBrackets;
        this.props.navigator.push({ title: 'TripView' });
	}
}

//This is the layout for this section of the system
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

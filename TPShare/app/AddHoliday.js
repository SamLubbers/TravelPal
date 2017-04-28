/*
* File describes a GUI for creating a new trip in the TravelPal system
*
* By Mollie Coleman, Rob Cobb (rbc31) | Bath University
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, TouchableHighlight,View, AppRegistry, StyleSheet,
        Image, Button, TextInput, Dimensions, TouchableOpacity, Alert, StatusBar} from 'react-native';

//import server comms for server communications
var server_comms = require("../server-comms");

/*
 * 
 */
export default class AddHoliday extends Component  {

    _handleBackPress() {
        this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
        this.props.navigator.push(nextRoute);
    }

    constructor(props) {
        super(props);

        //get socket - register callback
        this.socket = server_comms.getSock();
        this.socket.register_trip_creation_callback(this);


        this.state = ({ trip_name: '' });

    }


    render() {
        return(
            <View style={styles.container}>
			    <StatusBar barStyle="light-content"/>
		            <View style={styles.topBar}>
					    <TouchableOpacity onPress={this.goToHome.bind(this)}>
			                <Icon name="chevron-left" size={20} color='white'/>
						</TouchableOpacity>
						<Text style={styles.title}>
			                New Trip
						</Text>
						<Icon name="chevron-right" size={20} color='#1B9AF7'/>
					</View>
                    <Text style={styles.welcome}>
                        What would you like to call your Trip?
                    </Text>
					<View style={styles.field}>
                    <TextInput
                        style = { styles.textInput }
                        placeholder = "Enter Trip Name"
                        autoCapitalize = "none"
                        autoCorrect = { true }
                        onChangeText = { (trip_name) => this.setState({ trip_name }) }
                    />
					</View>
					<View style={styles.tripButtonContainer}>
					    <TouchableOpacity onPress={this.goCreateTrip.bind(this)}>
			                <Text style={styles.buttonTrip}>
				                Create Trip
							</Text>
						</TouchableOpacity>
					</View>
            </View>
        );
    }

    /*
    * Navigates to the home page
    */
    goToHome() {
				this.props.reRender();
        this.props.navigator.pop();
    }

    /*
    * Attempts to create a trip
    */
    goCreateTrip() {
        if (this.state.trip_name.length > 4 && this.state.trip_name.length < 50) {
            this.socket.create_trip(this.state.trip_name.replace(' ','_'));
        }else {
            Alert.alert("Cannot create trip","Length of trip must be bigger than 4 and smaller than 50")
        }
    }

    /*
    * Callback function, called when trip is created succesfully
    * Alerts user to creation and then navigates to the Home page
    */
    trip_creation_succ(trip_name) {
        Alert.alert("Trip Created",trip_name + " was created");
        this.goToHome();
    }

    /*
    * Callback function, called when a trip was not created succesfully
    * Alerts user to error
    */
    trip_creation_fail(reason) {

        errorMsg = "";
        switch (reason) {
            case 'INTERNAL_SERVER_ERROR':
                errorMsg = "Internal server error";
                break;
            case 'NOT_LOGGED_IN':
                errorMsg = "Client Error? - Not logged in";
                break;
            case 'INVALID_USE_OF_COMMAND':
                errorMsg = "Client Error? - Invalid use of server command";
                break;
            default:
                errorMsg = "Unknown Error - " +reason;
        }

        Alert.alert("Trip not created",errorMsg);
    }
}

/*
 *  This is used to create all the layout and formatting of the components
 *  on the page.
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

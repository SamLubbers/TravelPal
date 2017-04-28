/*
* File desrcibes a GUI for adding a new document to a trip_id
*
* File expects the server comms socket.trip_id to be set to the trip
* id of the trip to add the document too.
*
* By Rob Cobb (rbc31) | Bath University
*/

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, TextInput, View, Alert, Button, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';


//import socket comms to talk to server
var server_comms = require("../server-comms");

export default class AddDocument extends Component {

    constructor(props) {
        super(props);

        //get socket and register callbacks
        this.socket = server_comms.getSock();
		this.socket.register_create_doc_callback(this);

		this.state = {
            document: ""
        };
    }

    /*
    * Creates GUI for adding friends with a text box and add button as well as back button
    * This GUI contains a text area where the user can input information about the trip, there
    * is also the ability to delete and save the information added. The design is minamilistic,
    * yet functions perfectly and as planned. 
    */
    render() {
        return (
			<View style={styles.container}>
			    <StatusBar barStyle="light-content"/>
				    <View style={styles.topBar}>
					    <TouchableOpacity onPress={this.back.bind(this)}>
						    <Icon name="chevron-left" size={20} color='white'/>
						</TouchableOpacity>
						<Text style={styles.title}>
							New Activity
						</Text>
						<Icon name="chevron-right" size={20} color='#1B9AF7'/>
					</View>
				<Text style={styles.welcome}>
						Add a new activity
				</Text>
				<View style={styles.field}>
					<TextInput
						style = { styles.textInput }
						onChangeText = { (document) => this.setState({ document }) }
						placeholder = "Name"
						autoCapitalize = "none"
					/>
				</View>
				    <View style={styles.tripButtonContainer}>
			            <TouchableOpacity onPress={this.addDocument.bind(this)}>
				            <Text style={styles.buttonTrip}>
					            Add Activity
							</Text>
						</TouchableOpacity>
					</View>
			</View>
        );
    }

    /*
    * Navigates to the Trip GUI
    */
    back() {
				this.props.reRender();
        this.props.navigator.pop();
    }
    
    /*
    * Attempts to add a document to the trip
    */
	addDocument() {
            this.socket.create_document(this.state.document,this.socket.trip_id);
	}

    /*
    * Callback function, called when a document was added succesfully
    * Function alerts user and naviagtes back to trip page
    */
    add_document_succ(doc_name) {
        Alert.alert("Document created",doc_name +" was sucesfully created");
        this.back();
    }

    /*
    * Callback function, called when a document creation failed
    * Function alerts user to the reason for failure
    */
    add_document_fail(reason) {

        errorMsg = ""
        switch (reason) {
            case 'INTERNAL_SERVER_ERROR':
                errorMsg = "Internal server error";
                break;
            case 'GROUP_NOT_FOUND':
                errorMsg = "Client Error? - Trip not found";
                break;
            case 'NOT_AUTHORISED':
                errorMsg = "Client Error? - Not authorised";
                break;
            case 'NOT_LOGGED_IN':
                errorMsg = "Client Error? - Not logged in";
                break;
            case 'INVALID_USE_OF_COMMAND':
                errorMsg = "Client Error? - invalid server command";
                break;
            default:
                errorMsg = "Unexpected Error - " +reason;
        }

        Alert.alert("Document failed to be added",errorMsg);
    }
}

/*
 * This is the styles for the layout of the system is held and 
 * also the look of the components within the GUI so they are
 * called within the main part of the code in the class. 
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

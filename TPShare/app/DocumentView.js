/*
* File describes a component for viewing text documents
* 
* This allows the user to view the extra information that 
* they have added about the activities. There is a delete
* and save option. 
*
* By Robert Cobb (rbc31) | Bath University
*/

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Navigator, Text, TouchableHighlight,View, AppRegistry, StyleSheet,
				TextInput, Dimensions, TouchableOpacity, Alert, StatusBar} from 'react-native';

//import server_comms for server communication
var server_comms = require("../server-comms");

/*
 * This is where the GUI is generated/created. It sends the
 * content of the activity to the server to be saved within
 * the database. 
 */
export default class DocumentView extends Component {

    constructor(props) {
        super(props);

        //get socket - register callbacks
        this.socket = server_comms.getSock();
        this.socket.register_doc_exchange_callback(this);

        this.state = {
            doc_id  : this.socket.doc_id,
            name    : this.socket.doc_name,
            text    : ''
        };

        //download document
        this.socket.download_documnet(this.socket.doc_id);
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
					        {this.state.name}
						</Text>
						<TouchableOpacity onPress={this.delete_document.bind(this)}>
						    <Icon name="trashcan" size={20} color='white'/>
						</TouchableOpacity>
					</View>
				    <View style={{flex: 1}}>
                        <TextInput
                            style = { styles.creatingAccountDetails }
                            onChangeText = { (text) => this.setState({ text }) }
                            placeholder = "Enter Activity details"
                            autoCapitalize = "none"
                            autoCorrect = { false }
                            value = { this.state.text }
                            multiline = {true}
                            numberOfLines = {10}
                        />
					    <View style={styles.saveButtonContainer}>
						    <TouchableOpacity onPress={this.upload.bind(this)}>
				                <Text style={styles.buttonSave}>
					                Save
								</Text>
							</TouchableOpacity>
						</View>
					</View>
            </View>
        );
	}

		/*
		* Attempts to delete current document
		* NOTE: UNTESTED
		*/
		delete_document() {
				this.socket.delete_document(this.socket.doc_id);
		}

		/*
		* Callback function, called when document failed to be deleted
		* Alerts user to error
		* NOTE: UNTESTED
		*/
		doc_delete_fail(reason) {
				Alert.alert("Document not deleted",reason);
		}

	 /*
		* Callback function, called when document was deleted
		* Alerts user, head back to trip view page.
		* NOTE: UNTESTED
		*/
		doc_delete_succ(document) {
				Alert.alert("Activity was succesfully deleted");
				this.goBack();
		}
    /*
    * Navigates to the home page
    */
    goBack() {
				this.props.reRender();
        this.props.navigator.pop();
    }

    /*
    * Callback function, called when document download succeded
    * updates the document text.
    */
    doc_download_succ(text) {
        this.setState({text: text});
    }

    /*
    * Callback function, called when a document download failed
    * Alerts the user to the error
    */
    doc_download_fail(reason) {
        Alert.alert("Error in retreiving document", reason);
    }

    /*
    * Callback function, called when document upload succeded
    * Alerts the user to the saved changes
    */
    doc_upload_succ(doc) {
        Alert.alert("Saved","Changes where saved to the server");
				this.goBack();
    }

    /*
    * Callback function, called when a document upload failed
    * Alerts the user to the error
    */
    doc_upload_fail(reason) {
        Alert.alert("Error","Changes could not be saved becuase of " + reason);
    }

    /*
    * Attempts to upload the document to the server
    */
    upload() {
        this.socket.upload_document(this.state.doc_id,this.state.text);
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
saveButtonContainer:{
	padding:20,
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center'
},
buttonSave:{
	fontSize: 30,
	marginBottom: -30,
	color: '#1B9AF7',
	height: 40,
},
creatingAccountDetails: {
	padding: 5,
	paddingLeft: 10,
	margin: 10,
	marginTop: 60,
	borderRightWidth: 0,
	borderLeftWidth: 0,
	borderWidth: 2,
	borderRadius: 10,
	borderColor: '#1B9AF7',
	backgroundColor: 'white',
	fontSize: 16,
	height: 400
}
});

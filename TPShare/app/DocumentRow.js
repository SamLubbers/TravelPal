/*
* Component for rendering a document in a list box.
*
* Component expects document name in the format <document name>(<document id>)
* in the props.name variable.
*
* By Robert Cobb (rbc31) | Bath University
*/

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {Text, View, Alert, StyleSheet, TouchableOpacity} from 'react-native';

//import server_comms for server communications
var server_comms = require("../server-comms");

export default class DocumentRow extends Component {

    constructor(props) {
        super(props);
				//get socket - register callbacks
				this.socket = server_comms.getSock();
				this.socket.register_doc_exchange_callback(this);

                this.socket.doc_id = this.props.name.substring
                (this.props.name.indexOf('(')+1,this.props.name.indexOf(')'));

				this.state = {
						doc_id  : this.socket.doc_id,
						name    : this.socket.doc_name,
						text    : 'loading...'
				};
    }

    /*
    * Simple component that lists the name of the trip and provides a button
    * to open the trip
    */
		//<Icon name="trashcan" size={20} color='#EF3125'/>
	render() {
		var renderActivity = () =>{
			var tripName = this.props.name.split('(')[0];

			return tripName;
		}
        return(
		    <TouchableOpacity onPress ={this.document.bind(this)} >
			    <View style = {styles.container}>
				    <Text>
					    {renderActivity()}
					</Text>
					<Icon name="chevron-right" size={20} color='#1B9AF7'/>
				</View>
			</TouchableOpacity>
		);
	}
    /**
    * Puts the document name and id in the socket and calls the DocumentView
    * to open the document in a seperate page.
    */
	document() {
        var inBrackets  = this.props.name.substring
                (this.props.name.indexOf('(')+1,this.props.name.indexOf(')'));

        var beforeBrackets = this.props.name.substring
                (0,this.props.name.indexOf('('));

        this.socket.doc_id = inBrackets;
        this.socket.doc_name = beforeBrackets;
        this.props.navigator.push({
					title: 'DocumentView',
					reRender: this.props.reRender
				});
	}

}

/*
 * This only describes the layout of the page, nothing else. 
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

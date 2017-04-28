/*
* File describes a component for viewing trips
*
*
* By Robert Cobb (rbc31)
*
*/
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import ActionButton from 'react-native-action-button';
import {Navigator, Text, View, ListView, TouchableOpacity, TouchableHighlight, Alert, StatusBar, StyleSheet, RefreshControl} from 'react-native';
import Hr from 'react-native-hr';
import DocumentRow from './DocumentRow';

//import socket.io
var server_comms = require("../server-comms");

export default class TripView extends Component {

    _handleBackPress() {
      this.props.navigator.pop();
    }

    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
    }

    /*
    * Constructor, expects this.socket.trip_id to be the trip ID
    * and this.socket.trip_name to be the trip name.
    */
    constructor(props) {
        super(props);
        this.socket = server_comms.getSock();
        this.socket.get_documents_in_group(this.socket.trip_id);
        this.socket.register_doc_list_callback(this);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            trip_id : this.socket.trip_id,
            name    : this.socket.trip_name,
            docs    : this.ds.cloneWithRows([]),
						refreshing: false
        };
    };
    /*
    * Renders a simple showing the trip name and id
    * As well as button to view the trip in more detail
    */
		onRefresh(){
			this.socket.get_documents_in_group(this.state.trip_id);
		}
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
						<TouchableOpacity onPress={this.addFriend.bind(this)}>
							<Icon name="broadcast" size={20} color='white'/>
						</TouchableOpacity>
					</View>
					<View style = {{alignItems: 'center'}}>
	                    <Text style = {styles.activitiesTitle} >
		                    Trip Activities
						</Text>
					</View>
					<Hr lineColor="#aaa"/>
					<ListView
			            refreshControl={
				            <RefreshControl
					            refreshing={this.state.refreshing}
							    onRefresh={this.onRefresh.bind(this)}/>
							}
						    enableEmptySections={true}
							dataSource={this.state.docs}
							renderRow={(data) => <DocumentRow name = {data} navigator = {this.props.navigator} reRender={this.onRefresh.bind(this)}/>}
					/>
					<ActionButton
			            buttonColor="#1B9AF7"
						onPress={this.addDoc.bind(this)}
					/>
            </View>
        );
	}
    
    //If the adding of activity is successful, follow this function
    document_list_succ(list) {
        this.setState({docs : this.state.docs.cloneWithRows(list)});
    }

    //If the adding of activity is not successful, follows this funtion and sends error message to user
    document_list_fail(reason) {
        Alert.alert("Error - document list not recieved",reason);
    }

    // Adds the activity to the list
    addDoc() {
        this.props.navigator.push({
					title: 'AddDocument',
		      reRender: this.onRefresh.bind(this)
				});
    }
    
    // If wants to add a friend, press friends icon and this leads to the new page
    addFriend() {
        this.props.navigator.push({ title: 'AddFriendToGroup' });
    }

    /*
    * Navigates to the home page
    */
    goBack() {
        this.props.navigator.pop();
    }
}

/*
 * Styles section - layout and design of the components
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
activitiesTitle:{
	fontSize: 20,
	margin: 10,
	color: 'black'
}
});

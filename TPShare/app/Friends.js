/*
* Component for seeing friends and all friend related functions.
*
* This is the friends page, the GUI is generated within this section.
* It has many elements and consists of the friends you have and the
* requests you have pending. It follows the same design as the trips
* section, just with an extra option selection which contains extra
* elements appear.
*
* By Robert Cobb (rbc31)
*/

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import ActionButton from 'react-native-action-button';
import {Navigator, Text, View, ListView, TouchableOpacity, TouchableHighlight, Alert, StatusBar, StyleSheet, RefreshControl} from 'react-native';

import Hr from 'react-native-hr';


//components for friends and pending friends rendered in list view boxes
import FriendRow        from './FriendRow';
import PendingFriendRow from './PendingFriendRow';

//import socket wrapper
var server_comms = require("../server-comms");

export default class Friends extends Component {

    constructor(props) {
        super(props);

        //needed for listviews
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var HOST = '138.38.132.9';
        var PORT = '6969';

        //connects to server and registers callbacks
        //this.socket = server_comms.createSocket();
        //this.socket.connect('http://'+HOST+':'+PORT,{ jsonp: false,transports: ['websocket'] });
        //this.socket.login("ROBERT","PASSWORD");

        //get socket object and register relevant callbacks
        this.socket = server_comms.getSock();
        this.socket.register_friend_callback(this);

        //send requests to server
        this.socket.see_friends();
        this.socket.see_pending_friends();
        this.socket.see_sent_friend_requests();

        //data sources for listViews
        this.state = {
            friends: this.ds.cloneWithRows([]),
            pending: this.ds.cloneWithRows([]),
            sent   : this.ds.cloneWithRows([]),
						renderSection: 'friends',
						refreshing: false
        };
    };
		friendsView(){
			this.setState({
				renderSection: 'friends'
			});
		}
		pendingFriendsView(){
			this.setState({
				renderSection: 'pendingFriends'
			});
		}
		sentRequestsView(){
			this.setState({
				renderSection:'sentRequests'
			});
		}
    /*
    * Renders a gui for showing friends, pending friends and sent friend requests
    */
		onRefresh(){
			this.socket.see_sent_friend_requests();
		}
    render() {
			var renderFriends = () =>{
				if(this.state.renderSection == 'friends') {
            //returns the list views
          return (
				<View style = {{flex: 1}}>
	                <View style = {{alignItems: 'center'}}>
	                    <Text style = {styles.friendsTitle} >
	                        My Friends
	                    </Text>
	                </View>
					<Hr lineColor="#aaa"/>
	                <ListView
	                    enableEmptySections={true}
	                    dataSource={this.state.friends}
	                    renderRow={(data) => <FriendRow name = {data} />}
	                />
				</View>
				);
			}
				if(this.state.renderSection == 'pendingFriends') {
					return (
						<View style = {{flex: 1}}>
                            <View style = {{alignItems: 'center'}}>
                                <Text style = {styles.friendsTitle}>
                                    Pending Friends
                                </Text>
                            </View>
						    <Hr lineColor="#aaa"/>
                            <ListView
                                enableEmptySections={true}
                                dataSource={this.state.pending}
                                renderRow = {(data) => <PendingFriendRow name ={data}/>}
                            />
					     </View>
					        );
				  }
				if(this.state.renderSection == 'sentRequests') {
					return (
						<View style = {{flex: 1}}>
                            <View style = {{alignItems: 'center'}}>
                                <Text style = {styles.friendsTitle}>
                                    Sent Requests
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
                                dataSource= {this.state.sent}
                                renderRow = {(data) =>
								<View style = {styles.friendContainer}>
						            <Text>
							            {data}
									</Text>
								</View>
				}
                />
				</View>
                  );
        }
			}
			return(
				<View style={styles.container}>
					<StatusBar barStyle="light-content"/>
					<View style={styles.topBar}>
						<TouchableOpacity onPress={this.goToTrips.bind(this)}>
							<Icon name="chevron-left" size={20} color='white'/>
						</TouchableOpacity>
						<Text style={styles.title}>
							Friends
						</Text>
						<TouchableOpacity onPress={this.add_friend.bind(this)}>
						<Icon name="plus" size={20} color='white'/>
						</TouchableOpacity>
					</View>
					{renderFriends()}
					{/*Code taken from react-native-action-button documentation https://github.com/mastermoo/react-native-action-button*/}
					<ActionButton buttonColor="#1B9AF7">
	          <ActionButton.Item buttonColor='#1B9AF7' title="My Friends" onPress={this.friendsView.bind(this)}>
	            <Icon name="organization" size={20} color='white'/>
	          </ActionButton.Item>
	          <ActionButton.Item buttonColor='#1B9AF7' title="Pending Friends" onPress={this.pendingFriendsView.bind(this)}>
	            <Icon name="broadcast" size={20} color='white'/>
	          </ActionButton.Item>
	          <ActionButton.Item buttonColor='#1B9AF7' title="Sent requests" onPress={this.sentRequestsView.bind(this)}>
	            <Icon name="link-external" size={20} color='white'/>
	          </ActionButton.Item>
	        </ActionButton>
				</View>
			);

    }

    /*
    * Navigates to the home/Trips page
    */
    goToTrips() {
        this.props.navigator.pop();
    }


    //navigates to the add friend page when user clicks add friend button
    add_friend() {
        this.props.navigator.push({
					title: 'AddFriend',
					reRender: this.onRefresh.bind(this)
				});
    }

    /*
    * Callback function, called when a friends list is recieved.
    * list {array} - of friend usernames
    */
    friends_succ(list) {
        this.setState ({
            friends: this.state.friends.cloneWithRows(list),
            nothing: false
        });
    }

    /*
    * Callback function, called when a sent request list is recieved.
    * list {array} - of usernames user has sent friend requests to
    */
    sent_requests_succ(list) {
        this.setState ({
            sent: this.state.sent.cloneWithRows(list),
            nothing: false
        });
    }

    /*
    * Callback function, called when a 'see sent request' request failed.
    * reason {string} - reason why list was not retrieved.
    */
    sent_requests_fail(reason) {
        Alert.alert("Error in retreiving sent requests",reason);
    }

    /*
    * Callback function, called when a 'see friends request' request failed.
    * reason {string} - reason why list was not retrieved.
    */
    friends_fail(reason) {
        Alert.alert("Error in retreiving friends",reason);
    }

    /*
    * Callback function, called when a pending friends list is recieved.
    * list {array} - of usernames of users that have sent friend requests to you
    */
    pending_succ(list) {
        this.setState ({
            pending: this.state.pending.cloneWithRows(list),
            nothing: false
        });
    }

    /*
    * Callback function, called when a 'pending friends request' request failed.
    * reason {string} - reason why list was not retrieved.
    */
    pending_fail(reason) {
        Alert.alert("Error in retreiving pending friends",reason);
    }

    /*
    * Callback function, called when a delete friend request failed.
    * reason {string} - reason why list was not retrieved.
    */
    fail_delete_friend(reason) {
        Alert.alert("Error in deleting friend",reason);
    }

    /*
    * Callback function, called when a delete friend request succeeded
    * username {string} - username of friend deleted
    */
    succ_friend_deleted(username) {
        this.socket.see_friends();
    }

    /*
    * Callback function, called when a 'accept friend' request succeeded
    * username {string} - username of friend accepted
    */
    friend_accepted_succ(username) {
        this.socket.see_friends();
        this.socket.see_pending_friends();
    }

    /*
    * Callback function, called when a 'accept friend' request failed
    * reason {string} - reason why list was not retrieved.
    */
    friend_accepted_fail(reason) {
        Alert.alert("Could not accept freind",reason);
    }

    /*
    * Callback function, called when a 'ignore friend' request succeeded
    * username {string} - username of friend ignored
    */
    ignore_request_succ(username) {
        this.socket.see_pending_friends();
    }

    /*
    * Callback function, called when a 'ignore friend' request failed
    * reason {string} - reason why list was not retrieved.
    */
    ignore_request_fail(reason) {
        Alert.alert("Could not ignore request",reason);
    }
}

/*
 * Where all the layout and component design is stored
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
	friendsTitle:{
		fontSize: 20,
		margin: 10,
		color: 'black'
	},
	friendContainer:{
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

/* By Mollie Coleman
 *
 * This is the .js class for the Home page, once the user has signed into thier account,
 * this is the page which is leads to. This is out main page where the user can View and
 * and add holidays that are coming up. It is also the area where the profile can be
 * accessed.
 *
 * References:
 *          For the use of the banner:
 *              - http://browniefed.com/blog/the-shapes-of-react-native/
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import ActionButton from 'react-native-action-button';
import Hr from 'react-native-hr';
import {Navigator, Text, TouchableHighlight, View
, Button, StyleSheet, Alert, AppRegistry, ListView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';


import { Rectangle }    from 'react-shapes';
import TripRow          from './TripRow';
import PendingTripRow   from './PendingTripRow';

var server_comms = require("../server-comms");

/*
 * This is where the GUI is generated, it produces the home page which is
 * the trips page. This contains the current trips that the user is part
 * of, which are loaded from the database within the server. As well as
 * the pending trips whcih the user has been invited on and yet to accept
 * or decline
 */
export default class Home extends Component {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        //TODO remove for testing
        var HOST = '138.38.132.9';
        var PORT = '6969';

        //get comms, register callback, load trips
        this.socket = server_comms.getSock();
        this.socket.register_trip_callback(this);
        this.socket.see_pending_trips();
        this.socket.see_trips();
				this.onRefresh.bind(this);
        this.state = {
             trips:         this.ds.cloneWithRows([]),
             pendingTrips:  this.ds.cloneWithRows([]),
						 refreshing: false
        };
    }
		onRefresh(){
			this.socket.see_trips();
		}
    render() {
      return(
          <View style = { styles.container }>
						<StatusBar barStyle="light-content"/>
						<View style={styles.topBar}>
							<TouchableOpacity onPress={this.goSignInPage.bind(this)}>
								<Icon name="sign-out" size={20} color='white'/>
							</TouchableOpacity>
							<Text style={styles.title}>
								Trips
							</Text>
							<TouchableOpacity onPress={this.goFriends.bind(this)}>
								<Icon name="organization" size={20} color='white'/>
							</TouchableOpacity>
					</View>
					<View style={styles.trips}>
						<ListView
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh.bind(this)}/>
								}
								enableEmptySections={true}
								dataSource={this.state.trips}
								renderRow={(data) => <TripRow name = {data} navigator = {this.props.navigator} />}
						/>
						</View>
						<View style={styles.pendingTrips}>
						<Hr
							lineColor="#aaa"
							text="pending trips"
							/>
              <ListView
                enableEmptySections={true}
                dataSource={this.state.pendingTrips}
                renderRow={(data) => <PendingTripRow name = {data} />}
              />
					</View>
					<ActionButton
						buttonColor="#1B9AF7"
						onPress={this.goHoliday.bind(this)}
					/>
					</View>
      );
  	}

	/**
	* navigates to the sign in page
	*/
	goSignInPage() {
			this.props.navigator.pop();
    }

    goFriends() {
        this.props.navigator.push({ title: 'Friends' });
    }

    goHomePage() {
        this.props.navigator.push({ title: 'homePage' });
    }

    goHoliday() {
        this.props.navigator.push({
					title: 'addHoliday',
					reRender: this.onRefresh.bind(this)
				});
    }

    trips_list_succ(list) {
        this.setState ({
            trips: this.state.trips.cloneWithRows(list)
        });
    }

    trips_list_fail(reason) {
        Alert.alert("Error loading trip lists",reason);
    }

    pending_trips_list_succ(list) {
        this.setState ({
            pendingTrips: this.state.pendingTrips.cloneWithRows(list)
        });
    }

    accept_pending_fail(reason) {
        Alert.alert("Could not Join Group",reason)
    }

    accept_pending_succ() {
        this.socket.see_pending_trips();
        this.socket.see_trips();
    }
}

/*
 *  This is where the styles for each of the components are held
 *  these are usually consistent throught out the system.
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	tripsTitle: {
		fontSize: 20,
		margin: 10,
		color: '#1B9AF7',
	},
	trips:{
		flex: 2
	},
	pendingTrips:{
		flex: 2
	}
});

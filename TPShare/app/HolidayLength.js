/* 
 * This was not a used class but it will be beneficial for 
 * any later implementation for the trip functionality. 
 *
 * By Mollie Coleman
 */
import React, { Component } from 'react';
import {Navigator, Text, TouchableHighlight,View, AppRegistry, StyleSheet, 
        Image, Button, TextInput, Dimensions, TouchableOpacity} from 'react-native';
        
import DateTime from 'immutable-datetime';
import CalendarView from 'react-native-calendar-box';
   
/* 
 * This would allow the user to add a start and end date to the trip, for
 * later implementation
 */     
export default class HolidayLength extends Component {
    _handleBackPress() {
      this.props.navigator.pop();
  }
    _handleNextPress(nextRoute) {
      this.props.navigator.push(nextRoute);
  }
  constructor(props) {
  	super(props);
  	this.state = {
  	  	Name: '',
  		SurName: '',
		password: '',
		checkPassword: '',
		email: '',	
  	};
}
  render() {
    return( 
		<View style={styles.container}> 
	<Text style={styles.welcome}> 
		How long are you going for? 
	</Text> 
    <TextInput
	    style = { styles.destination }
	    placeholder = "Start Date"
	    autoCapitalize = "none"
	    autoCorrect = { true }
    />
    <TextInput
	    style = { styles.destination }
	    placeholder = "End Date"
	    autoCapitalize = "none"
	    autoCorrect = { true }
    />
    <Button 
	    onPress = { this.goToHolidayInfo.bind(this) }
	    title = 'Info with countdown' 
    />
        </View>
     	 );
     	}
        goToHolidayInfo() {
          console.log("holiday info");
          this.props.navigator.push({ title: 'holidayInfo' });
        }
}

/*
 *  This is used to create all the layout and formatting of the components
 *  on the page.
 */
const styles = StyleSheet.create({ 
	container: { 
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center',
		flexDirection: 'column'
	}, 
	welcome: { 
		fontSize: 20, 
		textAlign: 'center', 
		margin: 10, 
		fontSize: 40, 
		color: '#46c6f6', 
	}, 
	LogInUserScreen: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	destination: {
    	fontSize: 16,
    	height: 36,
    	padding: 10,
    	backgroundColor: '#FFFFFF',
  	  	borderColor: '#888888',
		borderWidth: 1,
		marginHorizontal: 20,
    	marginBottom: 10,
	},
    return: {
		backgroundColor: '#0000',
   		padding: 0,
    	alignItems: 'center',
    	marginBottom: 10,
    },
    selectedDate: {
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#000',
    }
}); 

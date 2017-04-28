/* By Mollie Coleman
 * 
 * This used to be the start screen, it would introduce the user to the 
 * system and have the logo
 * Now it has been removed :(
 */

import React, { Component } from 'react';
import {Navigator, Text, TouchableHighlight,View, AppRegistry, StyleSheet, 
        Image, Button, TextInput, Dimensions, TouchableOpacity} from 'react-native';

/*
 * The old welcome page...
 */
export default class Start extends Component {
    render() {
      return( 
  		<View style={styles.container}> 
      	<Text style={styles.introduction}> 
  		 	Welcome to 
  		</Text>
  		<Text style={styles.welcome}> 
          TravelPal {'\n'}
  		    <Text style={styles.undertext}> 
  			    The Travel Companion App 
  		    </Text> 
  		</Text> 
  		
  		<Image style = {styles.image} 
  			source={require('./TravelPalLogo2.png')} 
  		/> 
  		<TouchableOpacity onPress = { this.goSignIn.bind(this) } style = { styles.startTravellingButton }> 
  			<Text style={styles.buttonText}> 
  				Start Travelling 
  			</Text>
  		</TouchableOpacity>
  		</View>
  	 );
  	}
  goSignIn() {
    this.props.navigator.push({ title: 'SignIn' });
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
		fontSize: 80, 
		textAlign: 'center', 
		margin: 10, 
		fontSize: 40, 
		color: '#3399ff',
        fontFamily: 'AcademyEngravedLetPlain' 
	}, 
	introduction: {
		fontSize: 20, 
		textAlign: 'center', 
		margin: 10, 
		fontSize: 20, 
		color: '#000', 
	},
	image: { 
		width: 190, 
		height: 190, 
		alignItems: 'center', 
	},
    undertext: {
		fontSize: 20, 
		textAlign: 'center', 
		margin: 10, 
		fontSize: 20, 
		color: '#808080',
        fontFamily: 'AcademyEngravedLetPlain'  
    },
	startTravellingButton: {
		backgroundColor: '#4da6ff',
   		padding: 10,
    	alignItems: 'center',
    	marginBottom: 10,
	},
    buttonText: {
        color: '#ffffff',
        
    }
}); 

/**
 * Sign in page for the travel pal System. Allows users to sign in to an account
 *
 *
 * By Mollie Coleman, Robert Cobb (rbc31) | Bath University
 */

'use strict'
import React, { Component } from 'react';
import {Navigator, Text, TouchableHighlight,View, StyleSheet,
        Image, Button, TextInput, Dimensions, TouchableOpacity, Alert, StatusBar} from 'react-native';

//import socket communication logic
var server_comms = require("../server-comms");


//flag displaying is user is logged in
var loggedIn = false;

export default class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            username: '',
        };

        /*
        *  server and port defenition, change for different test set ups
        *  for android: host = "10.0.2.2"
        *  for mac    : host = ????
        *  port always 6969
        */
        var HOST = '138.38.132.9';
        var PORT = '6969';

        //connects to server and registers callbacks
        this.socket = server_comms.createSocket();
        this.socket.connect('http://'+HOST+':'+PORT,{ jsonp: false,transports: ['websocket'] });
        this.socket.register_login_callback(this);
    }

  /*
   * This renders the GUI for the log in screen, it has two text boxes and two buttons, one
   * which will lead you to the home screen and the other leads to a page that will allow
   * users to create an account. The input from the text fields are compared to the infomation
   * that is stored within the server to ensure that the information that the user has added
   * is correct to what is on the database.
   */
    render() {
        return(
			<View style={styles.container}>
                <StatusBar barStyle="dark-content"/>
			        <View style={styles.imageContainer}>
				        <Image style={styles.image} source={require('./images/login.png')} />
					</View>
                    {/*Username input*/}
        			<View style={styles.field}>
                        <TextInput
                            style = { styles.textInput }
                            onChangeText = { (username) => this.setState({ username }) }
                            placeholder = "Username"
                            autoCapitalize = "none"
                            autoCorrect = { false }
                            value = { this.state.username }
                        />
        			</View>

                    {/*Password input*/}
        			<View style={styles.field}>
                        <TextInput
                            style = { styles.textInput }
                            onChangeText = { (password) => this.setState({ password }) }
                            placeholder = "Password"
                            autoCapitalize = "none"
                            autoCorrect = { false }
                            secureTextEntry = { true }
                            value = { this.state.password }
                        />
        			</View>

        			<View style={styles.signinButtonContainer}>
        			    {/*Sign in button*/}
        	            <TouchableOpacity  onPress={this.attemptLogin.bind(this)}>
        				    <Text style={styles.buttonSignin}>
        		                Sign in
        					</Text>
        				</TouchableOpacity>
        			</View>
                	{/*create account label*/}
        			<View style={styles.signupButtonContainer}>
                        <Text style={styles.textSignup}>
                            Do not have an account? &nbsp;
        				</Text>
        			    {/*button to navigate to create an account*/}
        				<TouchableOpacity  onPress={this.goCreateAccount.bind(this)}>
        		            <Text style={styles.buttonSignup}>
        		                Sign up
        				    </Text>
        				</TouchableOpacity>
        			</View>
        </View>
         );
  	}

    /**
    * Sends a login request to server
    */
    attemptLogin() {
        this.socket.login(this.state.username, this.state.password);
    }

    /**
    * Loads the home page, if logged in. Reloads login page otherwise
    */
    goToHome() {
        this.props.navigator.push({ title: 'SignIn' });
    }

    /**
    * Navigate to the create account page
    */
    goCreateAccount() {
      this.props.navigator.push({ title: 'creatingAccount' });
    }

    /*
    * callback function, called when a log in was successful
    * Navigates to the home page
    */
    succ_login(username) {
        this.props.navigator.push({ title: 'homePage' });
    }

    /*
    * callback function, called when a log in failed
    * Alerts the user to the reason for the failure
    */
    fail_login(reason) {
        var errorMsg = "";

        //create user error message depending on server error
        switch (reason) {
            case 'INVALID_USE_OF_COMMAND':
                errorMsg = "must enter username and password";
                break;
            case 'INTERNAL_SERVER_ERROR':
                errorMsg = "Server Error";
                break;
            case 'INCORRECT_PASSWORD' :
                errorMsg = "Incorrect password";
                break;
            case 'USERNAME_NOT_FOUND':
                errorMsg = "Invalid username";
                break;
            case 'ALREADY_LOGGED_IN':
                errorMsg = "Unexpected error - already looged in?";
                break;
            default:
                errorMsg = ("Unknown error - "+ reason);
        }
        Alert.alert( 'Log in failed', errorMsg);
    }
}

/*
 *  This is used to create all the layout and formatting of the components
 *  on the page.
 */
const styles = StyleSheet.create({
	container: {
	flex: 1,
	justifyContent: 'flex-start',
	alignItems: 'stretch',
	paddingTop: 20,
	backgroundColor: 'white'
	},
	imageContainer:{
		alignItems: 'center',
		marginTop: 100,
		marginBottom: 80
	},
	image: {
		width: 280,
		height: 100,
		resizeMode: 'contain'
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
	signinButtonContainer:{
	padding:20,
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center'
	},
	signupButtonContainer:{
		padding:20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonSignin:{
		fontSize: 30,
		marginBottom: -30,
		color: '#1B9AF7',
		height: 40,
	},
	buttonSignup:{
		fontSize: 15,
		color: '#aaa',
		textDecorationLine: 'underline'
	},
	textSignup:{
		fontSize: 15,
		color: '#aaa'
	}
});

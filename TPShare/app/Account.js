/*
* File describes a GUI that allows users to create new accounts
* in the travel pal system. Also contains the communication 
* between the client and server to allow this creation to be 
* made. 
*
* By Mollie Coleman (mc2075), Rob Cobb (rbc31) | Bath university
*/
import React, { Component } from 'react';
import {Navigator, Text, TouchableHighlight, View, AppRegistry, StyleSheet,
        Image, Button, TextInput, Dimensions, TouchableOpacity, Alert, StatusBar} from 'react-native';

//import server communication logic
var server_comms = require("../server-comms");


export default class Account extends Component {

    constructor(props) {
        super(props);

        //get socket
        this.socket = server_comms.getSock();

        //register callback
        this.socket.register_create_account_callback(this);

        this.state = {
            username: '',
            createPassword: '',
            checkPassword: '',
            email: '',
        };
    }

    /**
    *  Returns GUI for creating an account,
    *  has a text entry for:
    *       username
    *       email
    *       password
    *       confim password
    * as well as button to create account and
    * button to navigate to sign-in page
    */
    render() {
        return(
            <View style={styles.container}>
                <StatusBar barStyle="dark-content"/>
				    <View style={styles.imageContainer}>
						<Image style={styles.image} source={require('./images/login.png')} />
				    </View>

				<View style={styles.field}>
                    {/*username text input*/}
                     <TextInput
                        style = { styles.textInput }
                        onChangeText = { (username) => this.setState({ username }) }
                        placeholder = "Username"
                     />
				</View>
				<View style={styles.field}>
                    {/*email address input*/}
                    <TextInput
                        style = { styles.textInput }
                        onChangeText = { (email) => this.setState({ email }) }
                        placeholder = "Email Adress"
                        autoCapitalize = "none"
                    />
				</View>
                    {/*password input*/}
					<View style={styles.field}>
                        <TextInput
                            style = { styles.textInput }
                            onChangeText = { (createPassword) => this.setState({ createPassword }) }
                            placeholder = "Password"
                            autoCapitalize = "none"
                            autoCorrect = { false }
                            secureTextEntry = { true }
                            maxLength = { 13 }
                            minLength = { 6 }
                            value = { this.state.createPassword }
                        />
					</View>
					<View style={styles.field}>
                        {/*confirm password text input*/}
                        <TextInput
                            style = { styles.textInput }
                            onChangeText = { (checkPassword) => this.setState({ checkPassword }) }
                            placeholder = "re-enter password"
                            autoCapitalize = "none"
                            autoCorrect = { false }
                            secureTextEntry = { true }
                            maxLength = { 13 }
                            minLength = { 6 }
                            value = { this.state.checkPassword }
                        />
					</View>
					    <View style={styles.signinButtonContainer}>
						    {/*sign up button*/}
							<TouchableOpacity  onPress={this.goSignIn.bind(this)}>
				                <Text style={styles.buttonSignin}>
					                Sign up
								</Text>
							</TouchableOpacity>
						</View>
                        {/*button to head to the login page*/}
                        <TouchableOpacity onPress = { this.goSignInPage.bind(this) } style = { styles.back }>
                            <Text style={styles.backText}> Back </Text>
                        </TouchableOpacity>
            </View>
             );
     	}

    /**
    * Attempts to create a new account
    */
    goSignIn() {
      if (this.state.checkPassword == this.state.createPassword) {
            this.socket.create_account(this.state.email,this.state.username,this.state.createPassword);
        }else {
            Alert.alert("Error","Passwords are not the same");
        }
    }

    /**
    * navigates to the sign in page
    */
    goSignInPage() {
        this.props.navigator.pop();
    }

    /*
    * Callback function, called when a new account was sucesfully created
    * function will log the user in
    * username {string} - the username of the user created
    */
    succ_create(username) {
        Alert.alert("Account Created",username+" Welcome to travelPal");
        this.props.navigator.push({title: 'homePage' });
    }

    /*
    * Callback function, called when an account was not created.
    * Alerts user to the error
    * reason {String} - reason why the account was not created
    */
    fail_create(reason) {
        errorMsg = "";

        //switch on error from server, create user error
        switch (reason) {
            case 'INTERNAL_SERVER_ERROR':
                errorMsg = "Internal server error";
                break;
            case 'USERNAME_TAKEN':
                errorMsg = "Username taken";
                break;
            case 'EMAIL_ALREADY_HAS_ACCOUNT':
                errorMsg = "Email taken";
                break;
            case 'PASSWORD_INVALID':
                errorMsg = "Password invalid, passwords must be between 8 and 50 chars with no special characters";
                break;
            case 'USERNAME_INVALID':
                errorMsg = "Username invalid, usernames must be between 4 and 50 chars with no special characters";
                break;
            case 'EMAIL_INVALID':
                errorMsg = "Email invalid, ";
                break;
            case 'ALREADY_LOGGED_IN':
                errorMsg = "Unexpected error - already logged in";
                break;
            case 'INVALID_USE_OF_COMMAND':
                errorMsg = "Must enter all fields";
                break;
            default:
                errorMsg = "Unknown error: " + reason;
        }
        Alert.alert("Login Failed",errorMsg);
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
		marginBottom: 40
	},
	image: {
		width: 280,
		height: 100,
		resizeMode: 'contain'
	},
	signinButtonContainer:{
	padding:20,
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center'
	},
	buttonSignin:{
		fontSize: 30,
		marginBottom: -30,
		color: '#1B9AF7',
		height: 40,
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
  back:{
  	alignItems: 'center',
  	marginTop: 20,
  },
	backText:{
		fontSize: 15,
		color: '#aaa'
	}
});

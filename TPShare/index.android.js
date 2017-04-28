/*
 * index.ios.js
 * index.android.js
 *
 * This is the section for the Android code, having the import allows the code from the index.js
 * doc (where all the code is called from) and this enables the code to be run with an Android
 * emulator
 *
 * INSTRUCTIONS:
 * Import the android folder into android studio, Set up an emulator within Android studio - press
 * the purple screen with android in front, then set it up, let it all download etc, then, once
 * this has completed, run  do 'npm install', then do 'react-native run-android'.
 *
 * Thanks to the sharing of code 2 (In comments index.js)
 */

 /*
  * index.ios.js
  * index.android.js
  *
  * This is the section for the IOS code, having the import allows the code from the index.js
  * doc (where all the code is called from) and this enables the code to be run with the IOS
  * emulator.
  *
  * INSTRUCTIONS:
  * To run this on another pc, delete all the files within './IOS/build/ModuleCache' and then
  * run as usual with 'react-native run-ios' as usual
  *
  * Thanks to the sharing of code 2 (In comments index.js)
  */
 import React from 'react';
 import {
   AppRegistry,
   StyleSheet
 } from 'react-native';
 import Index from './app/index';

 var TravelPal = React.createClass({
 	render() {
 		return (
 				<Index />
 		);
 	}
 });

 const styles = StyleSheet.create({
   navigatorStyle: {
     flex: 1,
   }
 });

 AppRegistry.registerComponent('TPShare', () => TravelPal);

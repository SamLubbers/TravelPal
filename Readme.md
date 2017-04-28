**IMPORTANT: A large proprtion of the code on this github repository is not developed by us, but it is instead code created by Facebook and which is necessary in any React Native application in order to compile React Native to Android and iOS. It is possible to identify which code is developed by our group and which is not by comparing our application with a test application of React Native, which should also contain the necessary code for the building of React Native applications**

# Running TravelPal
_*NOTE*:It is much easier to run application on iOS. React Native was originally built for iOS and has only recently been included for android so you may run into issues when trying to run it especially for the first time as it requires several specific installations_


## Client (TPShare folder)
##### Installing missing modules
Before running the app in any operating system we may need to install any missing modules by running '**npm install**'
### Run the app on iOS
_only possible from MacOS)_

1. run **react-native run-ios**

_or_

1. Open ios/TPShare.xcodeproj in Xcode
2. Hit the Run button

### Run the app on Android:

1. First do a bunch of lengthy setup stuff.
* MacOS: https://facebook.github.io/react-native/docs/getting-started.html
* Windows: https://facebook.github.io/react-native/docs/getting-started.html

2. Have an Android emulator running (quickest way to get started), or a device connected
3. run **react-native run-android**

---

## Server (server folder)
##### Installing missing modules
If any of the following modules are missing they should me installed:
* crypto: **npm install crypto**
* socket.io: **npm install socket.io**
* http: **npm install http**
* express: **npm install express**
* shortid: **npm install shortid**

### Running the server
1. install Node.js
2. install mySQL
3. run node server-main.js

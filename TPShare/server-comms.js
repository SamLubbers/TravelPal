/**
* File contains the server communications for the client.
*
* Client connects to the server using Socket.io and exchanges messages.
*
* File contains a static getSock function that will return the socket object for the app.
* This allows for passing of the socket object around the application.
*
* To create a new socket call the createSocket function. The getSock will return the last
* socket created by this function.
*
* Server communication works asynchronously, socket object wraps around the socket.io and allows
* for sending requests to the server via the relevant functions e.g. login function sends a login request
* to the server.
*
* Socket object also has function for registering callbacks for subsets of server events.
* When the socket object recieves an event from the server it will call the relevant method on the relevant object
* registered. Errors will be logged if no callback function is defined.
* e.g
*
*
* By Robert Cobb (rbc31) | Bath university
*/

//Different module required for different os
//for Android
//var io = require("socket.io-client/dist/socket.io");
//for IOS
var io = require("socket.io/node_modules/socket.io-client/dist/socket.io");


var soc = "Null";

module.exports = {

/*
* Get last socket created, will return 'Null' when no socket is defined
*/
getSock : function() {
    return soc;
},

/**
* Create socket function
*/
createSocket : function() {
    soc =  {

        //connects socket to a location
        //address should be of the form "127.0.0.1:0000"
        connect : function (address) {
            console.log("attemtping to connect to "+address);

            this.socket = io(address,{ jsonp: false,transports: ['websocket'] });

            this.socket.commsLogic = this;
            this.socket.address = address;

            //print to cms when a connection is established
            this.socket.on('connect', function () {
                console.log("connected to "+this.address);
            });

            /*
            * Function describes how the socket handles messages from the server
            * This function will parse the input then call the relevant callback
            * function if defined.
            */
            this.socket.on('data',function(msg) {

                args = msg.split(" ");//spliit into arguemnts - command at [0]

                for (i = 0;i<args.length;i++) {
                    args[i] = args[i].replace(/\r?\n|\r/g,'');
                }

                /**
                * Parse command and call the relavant function
                */
                switch (args[0]) {
                    case 'LOGIN_SUCCESSFUL':
                        if (typeof this.commsLogic.succ_login_callback === "function") {
                            this.commsLogic.succ_login_callback(args[1]);
                        }else {
                            console.log("error - succ login callback not defined")
                        }
                    break;
                    case 'LOGIN_FAILED':
                        if (typeof this.commsLogic.fail_login_callback === "function") {
                            this.commsLogic.fail_login_callback(args[1]);
                        }else {
                            console.log("error - fail login callback not defined")
                        }
                    break;
                    case 'ACCOUNT_CREATED':
                        if (typeof this.commsLogic.succ_create_account === "function") {
                            this.commsLogic.succ_create_account(args[1]);
                        }else {
                            console.log("error - account created callback not defined")
                        }
                    break;
                    case 'ACCOUNT_NOT_CREATED':
                        if (typeof this.commsLogic.fail_create_account === "function") {
                            this.commsLogic.fail_create_account(args[1]);
                        }else {
                            console.log("error - account not created callback not defined")
                        }
                    break;
                    case 'FRIENDS':
                        if (typeof this.commsLogic.friends_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                            }

                            this.commsLogic.friends_succ(list);
                        }else {
                            console.log("error - friend list callback not defined")
                        }
                    break;
                    case 'FAILED_TO_RETRIEVE_FRIENDS':
                        if (typeof this.commsLogic.friends_fail === "function") {

                            this.commsLogic.friends_fail(args[1]);
                        }else {
                            console.log("error - friend fail list callback not defined")
                        }
                    break;
                    case 'PENDING_REQUESTS':
                        if (typeof this.commsLogic.pending_friends_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                            }

                            this.commsLogic.pending_friends_succ(list);
                        }else {
                            console.log("error - pending friend succ list callback not defined")
                        }
                    break;
                    case 'FRIEND_DELETED':
                        if (typeof this.commsLogic.delete_friends_succ === "function") {
                            this.commsLogic.delete_friends_succ(args[1]);
                        }else {
                            console.log("error - delete friend succ callback not defined")
                        }
                        break;
                    case 'FRIEND_NOT_DELETED':
                        if (typeof this.commsLogic.delete_friends_fail === "function") {
                            this.commsLogic.delete_friends_fail(args[1]);
                        }else {
                            console.log("error - delete friend fail callback not defined")
                        }
                    break;
                    case 'FRIEND_REQUEST_SENT':
                        if (typeof this.commsLogic.add_friend_succ === "function") {
                            this.commsLogic.add_friend_succ(args[1]);
                        }else {
                            console.log("error - add friend succ callback not defined")
                        }
                    break;
                    case 'REQUEST_FAILED_TO_SEND':
                        if (typeof this.commsLogic.add_friend_fail === "function") {
                            this.commsLogic.add_friend_fail(args[1]);
                        }else {
                            console.log("error - add friend fail callback not defined")
                        }
                    break;
                    case 'REQUEST_ACCEPTED':
                        if (typeof this.commsLogic.accept_request_succ === "function") {
                            this.commsLogic.accept_request_succ(args[1]);
                        }else {
                            console.log("error - accept friend succ callback not defined")
                        }
                        break;
                    case 'FAILED_TO_ACCEPT_FRIEND':
                        if (typeof this.commsLogic.accept_request_fail === "function") {
                            this.commsLogic.accept_request_fail(args[1]);
                        }else {
                            console.log("error - accept friend fail callback not defined")
                        }
                        break;
                    case 'FRIEND_REQUEST_IGNORED':
                        if (typeof this.commsLogic.ignore_request_succ === "function") {
                            this.commsLogic.ignore_request_succ(args[1]);
                        }else {
                            console.log("error - ignore friend succ callback not defined")
                        }
                        break;
                    case 'FAILED_TO_IGNORE_REQUEST':
                        if (typeof this.commsLogic.ignore_request_fail === "function") {
                            this.commsLogic.ignore_request_fail(args[1]);
                        }else {
                            console.log("error - accept friend fail callback not defined")
                        }
                        break;
                    case 'SENT_REQUESTS':
                        if (typeof this.commsLogic.sent_requests_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                            }

                            this.commsLogic.sent_requests_succ(list);
                        }else {
                            console.log("error - sent request succ callback not defined")
                        }
                        break;
                    case 'FAILED_TO_RETRIEVE_REQUESTS':
                        if (typeof this.commsLogic.sent_requests_fail === "function") {
                            this.commsLogic.sent_requests_fail(args[1]);
                        }else {
                            console.log("error - sent request fail callback not defined")
                        }
                        break;
                    case 'GROUPS':
                        if (typeof this.commsLogic.trips_list_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                            }

                            this.commsLogic.trips_list_succ(list);
                        }else {
                            console.log("error - trip list succ callback not defined")
                        }
                        break;
                    case 'LIST_NOT_RETRIEVED':
                        if (typeof this.commsLogic.trips_list_fail === "function") {
                            this.commsLogic.trips_list_fail(args[1]);
                        }else {
                            console.log("error - trip list fail callback not defined")
                        }
                        break;

                    case 'PENDING_GROUPS':
                        if (typeof this.commsLogic.pending_trips_list_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                            }

                            this.commsLogic.pending_trips_list_succ(list);
                        }else {
                            console.log("error - pending trip list succ callback not defined")
                        }
                        break;
                    case 'GROUP_CREATED':
                        if (typeof this.commsLogic.trip_creation_succ === "function") {
                            this.commsLogic.trip_creation_succ(args[1]);
                        }else {
                            console.log("error - Trip creation succ callback not defined")
                        }
                        break;
                    case 'GROUP_NOT_CREATED':
                        if (typeof this.commsLogic.trip_creation_fail === "function") {
                            this.commsLogic.trip_creation_fail(args[1]);
                        }else {
                            console.log("error - Trip creation fail callback not defined")
                        }
                        break;
                    case 'GROUP_REQUEST_ACCEPTED':
                        if (typeof this.commsLogic.accept_pending_succ === "function") {
                            this.commsLogic.accept_pending_succ(args[1]);
                        }else {
                            console.log("error - pending trip accepted succ callback not defined")
                        }
                        break;
                    case 'GROUP_REQUEST_NOT_ACCEPTED':
                        if (typeof this.commsLogic.accept_pending_fail === "function") {
                            this.commsLogic.accept_pending_fail(args[1]);
                        }else {
                            console.log("error - pending trip accepted fail callback not defined")
                        }
                        break;
                    case 'DOCUMENTS':
                        if (typeof this.commsLogic.document_list_succ === "function") {

                            var list = [];
                            for (i = 1;i<args.length;i++) {
                                list.push(args[i]);
                                console.log(args[i]);
                            }

                            this.commsLogic.document_list_succ(list);
                        }else {
                            console.log("error - docuemnts list succ callback not defined")
                        }
                        break;
                    case 'DOCUMENTS_NOT_FOUND':
                        if (typeof this.commsLogic.document_list_fail === "function") {
                            this.commsLogic.document_list_fail(args[1]);
                        }else {
                            console.log("error - docuemnts list fail callback not defined")
                        }
                        break;
                    case 'DOWNLOAD_SUCCEEDED':
                        if (typeof this.commsLogic.doc_download_succ === "function") {
                            this.commsLogic.doc_download_succ(args[1].replace(/_/g,' '));
                        }else {
                            console.log("error - docuemnts download success callback not defined")
                        }
                        break;
                    case 'DOWNLOAD_FAILED':
                        if (typeof this.commsLogic.doc_download_fail === "function") {
                            this.commsLogic.doc_download_fail(args[1]);
                        }else {
                            console.log("error - docuemnts download success callback not defined")
                        }
                        break;
                    case 'DOCUMENT_UPLOADED':
                        if (typeof this.commsLogic.doc_upload_succ === "function") {
                            this.commsLogic.doc_upload_succ(args[1]);
                        }else {
                            console.log("error - docuemnts upload success callback not defined")
                        }
                        break;
                    case 'UPLOAD_FAILED':
                        if (typeof this.commsLogic.doc_upload_fail === "function") {
                            this.commsLogic.doc_upload_fail(args[1]);
                        }else {
                            console.log("error - docuemnts upload fail callback not defined")
                        }
                        break;
                    case 'DOCUMENT_ADDED':
                        if (typeof this.commsLogic.add_document_succ === "function") {
                            this.commsLogic.add_document_succ(args[1]);
                        }else {
                            console.log("error - add document succ callback not defined")
                        }
                        break;
                    case 'DOCUMENT_NOT_ADDED':
                        if (typeof this.commsLogic.add_document_fail === "function") {
                            this.commsLogic.add_document_fail(args[1]);
                        }else {
                            console.log("error - add document fail callback not defined")
                        }
                        break;
                    case 'GROUP_REQUEST_SENT':
                        if (typeof this.commsLogic.add_friend_to_group_succ === "function") {
                            this.commsLogic.add_friend_to_group_succ(args[1]);
                        }else {
                            console.log("error - add friend to group succ callback not defined")
                        }
                        break;
                    case 'GROUP_REQUEST_FAILED_TO_SEND':
                        if (typeof this.commsLogic.add_friend_to_group_fail === "function") {
                            this.commsLogic.add_friend_to_group_fail(args[1]);
                        }else {
                            console.log("error - add friend to group fail callback not defined")
                        }
                        break;
                    case 'DOCUMENT_DELETE_FAILED':
                        if (typeof this.commsLogic.doc_delete_fail === "function") {
                            this.commsLogic.doc_delete_fail(args[1]);
                        }else {
                            console.log("error - document deletion failed callback not defined")
                        }
                        break;
                    case 'DOCUMENT_DELETED':
                        if (typeof this.commsLogic.doc_delete_succ === "function") {
                            this.commsLogic.doc_delete_succ(args[1]);
                        }else {
                            console.log("error - document deletion failed callback not defined")
                        }
                        break;
                    default:
                        console.log("no parse info for command '"+ args[0] + "' in command "+msg);
                }
            });
        },

        //Attempts to login to server with the given username and password
        login: function (username, password) {
            this.socket.emit('data',"LOGIN " + username + " " + password);
        },

        //Attempts to create an account with the given email, username and password
        create_account: function (email ,username, password) {
            this.socket.emit('data',"CREATE_ACCOUNT " + email + " " + username + " " + password);
        },

        //Requests a list of friends from the server
        see_friends: function() {
            this.socket.emit('data',"SEE_FRIENDS");
        },

        //Requests a list of pending friend requests from server
        see_pending_friends: function() {
            this.socket.emit('data',"SEE_PENDING_REQUESTS");
        },

        //Requests a list of sent friend requests to server
        see_sent_friend_requests: function() {
            this.socket.emit('data',"SEE_SENT_REQUESTS");
        },

        //Sends a friend request to the given username
        add_friend: function(username) {
            this.socket.emit('data',"ADD_FRIEND "+username);
        },

        //accept a friend request from the given username
        accept_friend: function(username) {
            this.socket.emit('data',"ACCEPT_FRIEND "+username);
        },

        //ignores a friend request from the given username
        ignore_friend: function(username) {
            this.socket.emit('data',"IGNORE_FRIEND_REQUEST "+username);
        },

        //deletes a friend of the given username
        delete_friend: function(username) {
            this.socket.emit('data',"DELETE_FRIEND "+username);
        },

        //Asks the server to create a new trip
        create_trip: function(name) {
            this.socket.emit('data',"CREATE_GROUP " + name.replace(/ /g,'_'));
        },

        //Asks the server to see the trips the user is in
        see_trips: function() {
            this.socket.emit('data',"SEE_GROUPS");
        },

        //Asks to see the pending trip invitations
        see_pending_trips: function() {
            this.socket.emit('data',"SEE_PENDING_GROUPS");
        },

        /*
        * Attempts to add the given friend to the given group,
        * friend - {string} username of friend to add
        * group  - {string} trip ID of the trip to add the friend too
        */
        add_friend_to_group: function(friend, group) {
            this.socket.emit('data',"ADD_FRIEND_TO_GROUP " + group + " " +friend);
        },

        /*
        * Accepts an invatation to a group
        * group  - {string} trip ID of the trip to accept the invation of
        */
        accept_group_request: function(group) {
            this.socket.emit('data',"ACCEPT_GROUP_REQUEST " + group);
        },

        /*
        * Requests documents in a group
        * {string} group - trip ID of the trip to get the documents of
        */
        get_documents_in_group: function(group) {
            this.socket.emit('data',"GET_DOCUMENTS_IN_GROUP " +group);
        },

        /*
        * Requests download of the given document
        * {String} doc - the doc id of the document to get
        */
        download_documnet: function(doc) {
            this.socket.emit('data',"DOWNLOAD_DOCUMENT "+doc);
        },

        /*
        * Uploads a document to the server.
        * {String} doc_id - the id of the document to update
        * {String} text   - the text of the docuemnt to uplaod
        * Note: spaces ' ' are replaced by underscores '_'
        * and line feeds {\n} are replaced by tildas' '~'
        */
        upload_document: function (doc_id, text) {
            //Regex based off answer found here: http://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-tags
            this.socket.emit('data',"UPLOAD_DOCUMENT "+doc_id+" " + text.replace(/(?:\r\n|\r|\n)/g, '~').replace(/ /g,'_'));
        },

        /*
        * Creates a document in a trip
        * {Stirng} doc_name - the name of the document to create
        * {Stirng} group_id - the id of the group to add the document too
        */
        create_document: function (doc_name,group_id) {
            this.socket.emit('data',"ADD_DOCUMENT "+doc_name.replace(/ /g,'_')+" " + group_id);
        },

        /*
        * Deltes a document
        * {Stirng} doc_id - the id of the document to delete
        */
        delete_document: function(doc_id) {
            this.socket.emit('data',"DELETE_DOCUMENT "+doc_id);
        },

        /*
        * Registers callback functions for login events.
        * callback - {Object} the object to call when login events from the server
        * occur.
        * The object passed to this function will have the following functions called on the followiung events:
        *
        *
        *   On successful login - succ_login(username) will be called where username is the username of the user
        *   On failed login     - fail_login(reason)   will be called where reason is a string from the server
        *                                                detailing the reason for the login failure.
        *                                           see Server Client communication document for reason strings
        */
        register_login_callback(callback) {

            this.succ_login_callback = function (username) {
                callback.succ_login(username);
            }

            this.fail_login_callback = function (reason) {
                callback.fail_login(reason);
            }
        },

        /*
        * Registers callback functions for create account events.
        * callback - {Object} the object to call when account creation events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *   On successful creation - succ_create_account(userename) will be called where username is the username of the user created
        *   On failed creation     - fail_create_account(reason) will be called where reason is a string from the server
        *                                                       detailing the reason for the login failure.
        *                                                       see Server Client communication document for reason strings
        *
        */
        register_create_account_callback (callback) {

            this.succ_create_account = function (username) {
                callback.succ_create(username);
            }

            this.fail_create_account = function (reason) {
                callback.fail_create(reason);
            }
        },


        /*
        * Registers callback functions for *some* friend events.
        * callback - {Object} the object to call when friend events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *   friends_succ(list)          - Friends list is recieved from server
        *   friends_fail(reason)        - Friends list failed to be retrieved, reason is server error message
        *   pending_friends_succ(list)  - Pending friend list is recieved from server
        *   pending_friends_fail(reason)- Pending friends list failed, reason is server error message
        *   succ_friend_added(friend_id)- A friend has been added successfully
        *   fail_friend_added(reason)   - A friend add request failed, reason is server error message
        *   delete_friends_succ(frnd_id)- A friend delete request was successfully
        *   delete_friends_fail(reason) - A friend delete request failed, reason is server error message
        *   accept_request_succ(frnd_id)- A friend accept friend was successfully
        *   accept_request_fail(reason) - A friend accept friend failed, reason is server error message
        *   ignore_request_succ(fend_id)- An ignore friend request was successfully
        *   ignore_request_fail(reason) - An ignore friend request failed, reason is server error message
        *   sent_requests_succ(list)    - Sent requests list is recived from server
        *   sent_requests_fail(reason)  - Sent requests list failed to be retrieved, reason is server error message
        */
        register_friend_callback (callback) {

            this.friends_succ       = function(friends) {
                callback.friends_succ(friends);
            }

            this.friends_fail         = function(reason) {
                callback.friends_fail(reason);
            }

            this.pending_friends_succ = function(pending_friends) {
                callback.pending_succ(pending_friends);
            }

            this.pending_friends_fail = function(pending_friends) {
                callback.pending_fail(pending_friends);
            }

            this.succ_friend_added    = function(username) {
                callback.succ_friend_added(username);
            }

            this.fail_friend_added    = function(reason) {
                callback.fail_friend_added(username);
            }

            this.delete_friends_fail = function(reason) {
                callback.fail_friend_deleted(reason);
            }

            this.delete_friends_succ = function(username) {
                callback.succ_friend_deleted(username);
            }

            this.accept_request_succ = function(username) {
                callback.friend_accepted_succ(username);
            }

            this.accept_request_fail = function(reason) {
                callback.friend_accepted_fail(reason);
            }

            this.ignore_request_fail = function(reason) {
                callback.ignore_request_fail(reason);
            }

            this.ignore_request_succ = function(reason) {
                callback.ignore_request_succ(reason);
            }

            this.sent_requests_succ = function(list) {
                callback.sent_requests_succ(list);
            }

            this.sent_requests_fail = function(list) {
                callback.sent_requests_fail(list);
            }
        },

        /*
        * Registers callback functions for adding friend events.
        * callback - {Object} the object to call when adding friend events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *   On success of adding a friend - add_friend_succ(username) function will be called where username is the username of the friend added
        *   On failure of addinf a friend - add_friend_fail(reason)  will be called where reason is a string from the server
        *                                                       detailing the reason for the login failure.
        *                                                       see Server Client communication document for reason strings
        *
        */
        register_add_friends_callback (callback) {
            this.add_friend_succ = function(username) {
                callback.add_friend_succ(username);
            }

            this.add_friend_fail = function (reason){
                callback.add_friend_fail(reason);
            }
        },

        /*
        * Registers callback functions for trip events.
        * callback - {Object} the object to call when trip events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *   trips_list_succ(list)        - Trip list recieved from server
        *   trips_list_fail(reason)      - Trip list (pending or not) failed to be retreived, reason is server error message
        *   pending_trips_list_succ(list)- Pennding trip list recieved from server
        *   accept_pending_succ(trip_id) - Accept pending request was successfully
        *   accept_pending_succ(reason)  - Accept pending request failed, reason is server error message
        */
        register_trip_callback(callback) {

            this.trips_list_succ = function(trips) {
                callback.trips_list_succ(trips);
            }

            this.trips_list_fail = function(reason) {
                callback.trips_list_fail(reason);
            }

            this.pending_trips_list_succ = function(list) {
                callback.pending_trips_list_succ(list)
            }

            this.accept_pending_succ = function(trip) {
                callback.accept_pending_succ(trip);
            }

            this.accept_pending_fail = function(reason) {
                callback.accept_pending_fail(reason);
            }
        },

        /*
        * Registers callback functions for trip creation events.
        * callback - {Object} the object to call when trip creation from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *       trip_creation_succ(trip_name) - Trip was created successfully
        *       trip_creation_fail(reason)    - Trip could not be created, reason is server error message
        */
        register_trip_creation_callback(callback) {

            this.trip_creation_succ = function(trip_name) {
                callback.trip_creation_succ(trip_name);
            }

            this.trip_creation_fail = function(reason) {
                callback.trip_creation_fail(reason);
            }
        },

        /*
        * Registers callback functions for doc list events.
        * callback - {Object} the object to call when doc list events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *       document_list_succ(list)      - Document list retrevied successfully
        *       document_list_fail(reason)    - Document list could not be retrevied, reason is server error message
        */
        register_doc_list_callback(callback) {

            this.document_list_succ = function (list) {
                callback.document_list_succ(list);
            }

            this.document_list_fail = function (reason) {
                callback.document_list_succ(reason);
            }
        },

        /*
        * Registers callback functions for doc exchange events.
        * callback - {Object} the object to call when doc exchange events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *       doc_upload_succ             - Document upload was successfull
        *       doc_upload_fail(reason)     - Document upload failed
        *       doc_download_succ           - Document download was successfull
        *       doc_download_fail(reason)   - Document download failed
        *       doc_delete_succ             - Docuemnt delete was successfull
        *       doc_delete_fail (reason)    - Docuemnt delete failed
        */
        register_doc_exchange_callback(callback) {

            this.doc_upload_succ = function(text) {
                callback.doc_upload_succ(text);
            }

            this.doc_upload_fail = function(text) {
                callback.doc_upload_fail(text);
            }

            this.doc_download_succ = function(text) {
                callback.doc_download_succ(text.replace(/~/g, '\n'));
            }

            this.doc_download_fail = function(text) {
                callback.doc_download_fail(text);
            }

            this.doc_delete_succ = function(document) {
                callback.doc_delete_succ(document);
            }

            this.doc_delete_fail = function(reason) {
                callback.doc_delete_fail(reason);
            }
        },

        /*
        * Registers callback functions for create document events.
        * callback - {Object} the object to call when create document events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *       add_document_succ(doc_name) - Document created successfull
        *       add_document_succ(reason)   - Document creation failed
        */
        register_create_doc_callback(callback) {

            this.add_document_succ = function(doc) {
                callback.add_document_succ(doc);
            }

            this.add_document_fail = function(reason) {
                callback.add_document_fail(reason);
            }

        },

        /*
        * Registers callback functions for adding friends to groups events.
        * callback - {Object} the object to call when adding friends to groups events from the server
        * occur.
        * The object passed to this function will have the following functions called on the following events:
        *
        *       add_friend_to_group_succ(friend)   - Friend was added successfully
        *       add_friend_to_group_succ(reason)   - Friend was failed to be added
        */
        register_friend_to_group_callback(callback) {

            this.add_friend_to_group_succ = function(friend) {
                callback.add_friend_to_group_succ(friend);
            }

            this.add_friend_to_group_fail = function(reason) {
                callback.add_friend_to_group_fail(reason);
            }
        }

    };
    return soc;
}
}

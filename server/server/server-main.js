/**
* Main server class of the TravelPal system
*
* Functionality
* -------------
* Module accepts socket connections on the 6969 port and allows connected sockets
* to use a set of commands. Commands:
*
*         LOGIN <username> <password>                   : lets users log in 
*         CREATE_ACCOUNT <email> <username> <password>  : lets clients create an account
*         SEE_FRIENDS                                   : Returns a list of friends the user has [must be logged in]
*         SEE_PENDING_REQUESTS                          : Returns a list of friend requests a user has pending [must be logged in]
*         SEE_SENT_REQUESTS                             : Returns a list of sent friend requests [must be logged in]
*         ADD_FRIEND <username of friend to add>        : Adds a friend from username [must be logged in]
*         ACCEPT_FRIEND <username to accept>            : Accept a friend request from a user [must be logged in]
*         IGNORE_FRIEND_REQUEST <username>              : Ignore a friend request from a user [must be logged in]
*         DELETE_FRIEND <username>                      : Deletes an existing friend [must be logged in]
*         WHO                                           : Tells you who you are logged in as - returns 0 if not logged in
*         CREATE_GROUP <group_name>                     : Creates a group of the given name
*         SEE_GROUPS                                    : see a list of group ID's the user is a member of
*         SEE_PENDING_GROUPS                            : see a list of pending groups
*         ADD_FRIEND_TO_GROUP <group id> <friend>       : adds the given friend to a group
*         DELETE_TRIP <trip_id>                         : Deletes a trip 
*         ACCEPT_GROUP_REQUEST <group id>               : accepts an invitation to joing the given group
*         ADD_DOCUMENT <document name> <trip id>        : adds a new document of the given name to the trip
*         UPLOAD_DOCUMENT <doc id> <text>               : uploads a document Note: only supports text
*         DOWNLAOD_DOCUMENT <doc id>                    : requests download of the document 
*         DELETE_DOCUMENT <doc id>                      : Deletes the document                              
*
* @author
* Robert Cobb | rbc31@bath.ac.uk
* University of Bath
*/

/**
* User data contained in mySql database - module required to interface with database
*/
var mysql = require('mysql');

/**
* Module to create hashed passwords 
*/
var crypto = require('crypto');

/*
* Used for file reading/writing
*/
const path = require('path');

/*
* If true server will print incomming messages
*/
var print = true;

/**
* for generating specific id's to identify each client uniqly
*/
var shortid = require('shortid');

/**
* Modules required for socket hosting
*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
* Server is hosted at given address and port
*/
var HOST = "127.0.0.1";
var PORT = 6969;

/**
* Database credentials
*/
var db = mysql.createConnection({
    host: 'localhost',
    user: 'Rob',
    password: 'IPProjectGroup-9',
    database: 'ip'
});

/**
* Connect to database, log error if exists
*/
db.connect(function(err){
    if (err) {
        console.log("Error occred when connecting to database...")
        console.log(err);
    }
});

/**
* Dictionary holding socket to usernames
* if socket hasnt logged in then dict will return 0
*/
var dict = {};
var reverse_dict = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/**
* Server definition
*/
io.on('connection', function(sock){
    
    /**
    * Each socket is assigned a unique Id number stored in 
    * .id property - dict maps these id's to usernames
    */
    sock.id = shortid.generate();
    
    dict [sock.id] = 0;
    
    console.log('New Client has connected');
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        clientStr = String(data).trim();//convert to string remove line feeds 
        
        if (print) {
            console.log("From client: "+clientStr);
        }
       
        args = clientStr.split(" ");//spliit into arguemnts - command at [0]
        
        /**
        * Parse command call relavant function
        */
        switch (args[0]) {
            //user and friend commands
            case 'LOGIN':
                login(sock,args);
                break;
            case 'CREATE_ACCOUNT':
                createAccount(sock,args);
                break;
            case 'WHO':
                sock.emit('data',"you are logged in as "+dict[sock.id]+'\r\n');
                break;
            case 'SEE_FRIENDS':
                seeFriends(sock);
                break;
            case 'SEE_PENDING_REQUESTS':
                seePending(sock);
                break;
            case 'SEE_SENT_REQUESTS':
                seeSent(sock);
                break;
            case 'ADD_FRIEND':
                addFriend(sock, args);
                break;
            case 'ACCEPT_FRIEND':
                acceptFriend(sock,args);
                break;
            case 'IGNORE_FRIEND_REQUEST':
                ignoreFriend(sock,args);
                break;
            case 'DELETE_FRIEND':
                deleteFriend(sock,args);
                break;
                
                //group commands
                
            case 'CREATE_GROUP':
                createGroup(sock,args);
                break;
            case 'SEE_GROUPS': 
                seeGroups(sock,args,false);
                break;
            case 'SEE_PENDING_GROUPS': 
                seeGroups(sock,args,true);
                break;
            case 'ADD_FRIEND_TO_GROUP' :
                addFriendToGroup(sock,args);
                break;
            case 'ACCEPT_GROUP_REQUEST':
                acceptGroupRequest(sock,args);
                break;
            case 'DELETE_TRIP':
                deleteTrip(sock,args);
                break;
                
            // document commands
            
            case 'ADD_DOCUMENT':
                addDocument(sock,args);
                break;
            case 'GET_DOCUMENTS_IN_GROUP':
                getDocuementsInGroup(sock,args);
            break;
            case 'DOWNLOAD_DOCUMENT':
                downloadDocument(sock,args);
            break;
            case 'UPLOAD_DOCUMENT':
                uploadDocument(sock,args);
            break;
            case 'DELETE_DOCUMENT':
                deleteDocument(sock,args);
                break;
            default:
                sock.emit('data',"Unrecognised command: \""+args[0]+"\" \r\n");
        }       
    });
    
    sock.on('close', function(data) {
        console.log('Client disconnected ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
    sock.on ('error', function(data) {
         console.log('Error occurred, most likely a client crash...');
    });
 
}); 

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});


/**
* Function for deleting a friend
* @function
* @param {socket object} sock - the client socket that requests frien deletion
* @param {String[]} args - the delete arguments (0 is expected to be DELETE command)
*/
function deleteFriend(sock,args) {
    if (args.length == 2) { // if correct length of arguments
        usernameA = dict[sock.id];  //username of client
        usernameB = args[1];        //user to delete
        
        if (loggedIn(sock)) {
            //check that users are friends
            friends(usernameA, usernameB,function(err,friends) {
                
                if (err) {//error from connecting to database
                    console.log(err);
                    sock.emit('data',"FRIEND_NOT_DELETED INTERNAL_SERVER_ERROR " + usernameB+"\r\n");
                    return;
                }
                
                if (!friends) {//not friends - delete fails
                     sock.emit('data',"FRIEND_NOT_DELETED NO_FRIEND_FOUND " + usernameB+"\r\n");
                }else {
                    deleteFriendshipInDB(usernameA,usernameB);
                    sock.emit('data',"FRIEND_DELETED " + usernameB+"\r\n");
                }
            });
        }else {
            sock.emit('data',"FRIEND_NOT_DELETED NOT_LOGGED_IN " + usernameB + "\r\n");
        }
    }else {
        sock.emit('data',"FRIEND_NOT_DELETED INVALID_USE_OF_COMMAND\r\n");
    }
}

/**
* Deletes a friendship in the database - does not check if friend request has been added
* @function
* @param {String} usernameA - username of friendship to delete
* @param {String} usernameB - username of other friendship to delete
*/
function deleteFriendshipInDB(usernameA,usernameB) {
    //delete friendships in both directions
    var query = "DELETE FROM friends WHERE user_a = '" + mysql.escape(usernameA) + "' AND user_b ='" + mysql.escape(usernameB) + "';"
    db.query(query);
    
    query = "DELETE FROM friends WHERE user_a = '" + mysql.escape(usernameB) + "' AND user_b ='" + mysql.escape(usernameA) + "';"
    db.query(query);
}

/**
* Allows one client to ignore another
* @function
* @param {Socket object} sock - The socket object that called the ignore_friend command
* @param {String []} args - The arguments send in the command (args[0] is expected to be IGNORE_FRIEND command word)
*/
function ignoreFriend(sock,args) {
     if (args.length == 2) { //corrrect number of words in command
        var usernameA = dict[sock.id];  //username of client
        var usernameB = args[1];        //username of user to ignore
        
        if (loggedIn(sock)) {
            
            //check that there is a pending request
            pending(usernameA,usernameB, function(err,pending) {
            
            if (err) { //err when connecting to database
                console.log(err);
                sock.emit('data',"FAILED_TO_IGNORE_REQUEST INTERNAL_SERVER_ERROR\r\n");
                return;
            }
            
            if (!pending) {//if there is no request - ignore fails
                sock.emit('data',"FAILED_TO_IGNORE_REQUEST NO_REQUEST_FOUND " + usernameB+"\r\n");
            }
            
            if (pending) {//ignore request
                deleteFriendshipInDB(usernameA,usernameB);
                sock.emit('data',"FRIEND_REQUEST_IGNORED " + usernameB+"\r\n");
            }
        });
        
        }else {
            sock.emit('data',"FAILED_TO_IGNORE_REQUEST NOT_LOGGED_IN " + usernameB +"\r\n");
        }
    }else {
        sock.emit('data',"FAILED_TO_IGNORE_REQUEST INVALID_USE_OF_COMMAND\r\n");
    }
}

/**
* Edits the database so usernameA accpets usernameB's request
* @function
* @param {string} usernameA - the username of the user accepting the request
* @param {String} usernameB - the username of the user who's request is being accepted 
*/
function acceptRequestInDB(usernameA, usernameB) {
    query = "UPDATE friends SET pending = false WHERE user_a ='"+ mysql.escape(usernameA) + "'AND user_b ='" + mysql.escape(usernameB) + "';"
    db.query(query);
}

/**
* Allows a cleint to accept a friend request
* @function
* @param {socket object} sock - the socket of the client calling the accept command
* @param {String[]} args - the arguments sent by the client (Note: args[0] is expected to be the ACCEPT command word)
*/
function acceptFriend(sock,args) {
    if (args.length == 2) { //correct number of arguments
    
        var usernameA = dict[sock.id];  //username of client making accept request
        var usernameB = args[1];        //username of user to accept request
        
        if (loggedIn(sock)) { //must be logged in to use command
            
            //does the user exist in the system
            isUsernameFree(usernameB,function(err,free) {
                
                if (err) {//log error and report to client
                    console.log(err);
                    sock.emit('data',"FAILED_TO_ACCEPT_FRIEND INTERNAL_SERVER_ERROR\r\n");
                    return;
                }
                
                if (free) {//if the user doesn't exist
                    sock.emit('data',"FAILED_TO_ACCEPT_FRIEND USER_NOT_FOUND\r\n");
                }else {
                    //check there is a pending request to accept
                    pending(usernameA,usernameB,function(err,pending){
                        
                        if (err) {//log error and report to client
                            console.log(err);
                            sock.emit('data',"FAILED_TO_ACCEPT_FRIEND INTERNAL_SERVER_ERROR\r\n");
                            return;
                        }
                        
                        if (pending) {//there is a request to accept
                            acceptRequestInDB(usernameA,usernameB);
                            sock.emit('data',"REQUEST_ACCEPTED " + usernameB + "\r\n");
                        }else {//no request
                            sock.emit('data',"FAILED_TO_ACCEPT_FRIEND NO_REQUEST_FOUND " + usernameB +"\r\n");
                        }
                    });
                }
            });
        }else {
            sock.emit('data',"FAILED_TO_ACCEPT_FRIEND NOT_LOGGED_IN " + usernameB + "\r\n");
        }
    }else {
        sock.emit('data',"FAILED_TO_ACCEPT_FRIEND INVALID_USE_OF_COMMAND\r\n");
    }
}

/**
* Returns true if usernameA is friends with username B 
* or usernameA has sent a friend request to usernameB
* @function
* @param {String} usernameA - the user to check the friend status of 
* @param {String} usernameB - the user to check the friend status with
* @param {function} callback - the function to call back when recived server response
*/
function friends(usernameA, usernameB, callback) {
    
    var query = "SELECT user_a FROM friends WHERE user_a = '" + mysql.escape(usernameA) +"' AND user_b = '" + mysql.escape(usernameB) +"' AND pending = false;"
   
   db.query(query,function(err,rows){
          if(err) {
              callback(err,null);//send error to callback
          }else {//send callback right bool flag
              if (rows.length == 0) {//no friend record found
                callback(null,false);
              }else {//friend record found
                  callback(null,true);
              }
          }
    });
}

/**
* Returns true if usernameA has been sent a friend request by usernameB that has not been accepted
* @function
* @param {String} usernameA - the user to check the pending status of
* @param {String} usernameB - the user to check the pending status with
* @param {function} callback - the function to call back when recived server response
*/
function pending(usernameA, usernameB, callback) {
    var query = "SELECT user_a FROM friends WHERE user_a = '" + usernameA +"' AND user_b = '" + usernameB +"' AND pending = 1;"
    db.query(query,function(err,rows){
          if(err) {
              callback(err,null);
          }else {//send callback right bool flag
              if (rows.length == 0) {//no rows => no pending request
                callback(null,false);
              }else {//pending request
                  callback(null,true);
              }
          }
    });
}

/**
* Adds a friend request to the database
* User A adds User B and user B is given a request from A (pending flag set to true)
* @function
* @param {String} usernameA - the username of the user adding user B as a friend
* @param {Stirng} usernameB - the username of the user being added by user A
*/
function addFriendToDB(usernameA, usernameB) {
    //pending flag false as A implicitly accepts request 
    query = "Insert INTO friends(user_a,user_b,pending) VALUES ('"+mysql.escape(usernameA)+"','"+ mysql.escape(usernameB) + "', false);"
    db.query(query,function(err){
        if(err) {
            console.log(err);
        }
    });
    
    //pending flag set to true, B needs to be consulted
    query = "Insert INTO friends(user_a,user_b,pending) VALUES ('"+mysql.escape(usernameB)+"','"+ mysql.escape(usernameA) + "', true);"
    db.query(query,function(err){
        if(err) {
            console.log(err);
        }
    });
}

/**
* Allows a user to add another user
* @function
* @param {socket object} sock - the socket of the client adding a friend
* @param {String[]} args - the arguments sent by the client (NOTE: args[0] is expected to be the ADD_FRIEND command word)  
*/
function addFriend(sock, args) {
    if (args.length == 2) {     //correct number of arguments
        
        var usernameA = dict[sock.id];  //user adding a friend
        var usernameB = args[1];        //user being added as a friend
        
        if (loggedIn(sock)) {   //only useable by logged in users
        
            //check user being added is a valid user
            isUsernameFree(usernameB,function(err, free) {
                
                if (err) {//log error and inform client of error
                    console.log(err);
                    sock.emit('data','REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                    return;
                }
                
                if (free) {//user doesn't exist
                    sock.emit('data','REQUEST_FAILED_TO_SEND USERNAME_NOT_FOUND ' + args[1] + '\r\n');
                }else {
                    
                    //Don't allow user to add themselves
                    if (usernameA == usernameB) {
                        sock.emit('data','REQUEST_FAILED_TO_SEND CANNOT_FRIEND_SELF\r\n');
                        return;
                    }
                    
                    //Check user's aren't already friends
                    friends(usernameA,usernameB,function(err,areFriends) {
                        
                        if (err) {//log error and inform client of error
                            console.log(err);
                            sock.emit('data','REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                            return;
                        }
                        
                        if (areFriends) {//user's are already friends
                            sock.emit('data','REQUEST_FAILED_TO_SEND USER_ALREADY_FRIEND_OR_PENDING ' + args[1] +'\r\n');
                            return;
                        }else {
                            
                            //check there isn't already a friend request
                            pending(usernameA,usernameB,function(err,pending){
                                
                                if (err) {//log error and inform client of error
                                    console.log(err);
                                    sock.emit('data','REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                                    return;
                                }
                                
                                if (pending) {//there is a request - just accept pending request
                                    acceptRequestInDB(dict[sock.id],args[1]);
                                    sock.emit('data',"FRIEND_ADDED "+args[1]);
                                }else {//add friend request
                                    addFriendToDB(dict[sock.id],args[1]);
                                    sock.emit('data',"FRIEND_REQUEST_SENT "+args[1]+"\r\n");
                                    
                                    //send notification to username B if he is connected
                                    var sockB = reverse_dict[usernameB];
                                    if (sockB != null && sockB != undefined) {
                                        sockB.emit('data',"FRIEND_REQUEST_FROM "+usernameA + "\r\n");
                                    }
                                    
                                }
                            });
                        }
                     });
                }
            });
        }else {
            sock.emit('data',"REQUEST_FAILED_TO_SEND NOT_LOGGED_IN " + args[1] + "\r\n")
        }
    }else {
        sock.emit('data','REQUEST_FAILED_TO_SEND INVALID_USE_OF_COMMAND\r\n');
    }
}

/**
* Gets all friend requests sent by a user - returns through callback function
* @function
* @param {string} username - username of the user to get the sent friend request of.
* @param {function} callback - Function to callback when sql server responds responds with error and row params 
*/
function getSent(username,callback) {
    var query = "SELECT user_a FROM friends WHERE user_b = '" + mysql.escape(username) +"' AND pending = true;"
    db.query(query,function(err,rows){
          if(err) {
              callback(err,null);
          }else {
              callback(null,rows);
          }
    });
}

/**
* Allows clients to see a list of friend requests they have sent 
* (That havn't been accepted)
* @function
* @param {socket object} sock - the socket of the client making the request
*/
function seeSent(sock) {
     if (loggedIn(sock)) {//only useable for logged in clients
     
        //get all the sent requests
        getSent(dict[sock.id],function(err,friends){
            
            if (err) {//log error and inform client
                console.log(error);
                sock.emit('data',"FAILED_TO_RETRIEVE_REQUESTS INTERNAL_SERVER_ERROR\r\n");
                return;
            }
            
            var toReturn = "SENT_REQUESTS"
            
            //build up string to return
            for (var i = 0; i < friends.length; i++) {
              toReturn+= " " + friends[i]['user_a'];
            } 
            
            sock.emit('data',toReturn+'\r\n');
        });
    }else {
        sock.emit('data',"FAILED_TO_RETRIEVE_REQUESTS NOT_LOGGED_IN\r\n")
    }
}

/**
* Returns (through callback function) all pending friend requests the user has
* @function 
* @param {String} - username of user to get pending requests of
* @param {function} - callback function to call when sql server responds, called with error and rows object
*/
function getPending(username,callback) {
   
    var query = "SELECT user_b FROM friends WHERE user_a = '" + mysql.escape(username) +"' AND pending = 1;"
    db.query(query,function(err,rows){
          if(err) {
              callback(err,null);
          }else {
              callback(null,rows);
          }
    });
}

/**
* Allows a client to view the pending friend requests they have (requests sent to them)
* @function 
* @param {socket object} sock - the socket of the client that initaed the request
*/
function seePending(sock) {
     if (loggedIn(sock)) {  //useable by only logged in clients
     
        //get pending requests
        getPending(dict[sock.id],function(err,friends){
            
            if (err) {
                console.log(error);
                sock.emit('data',"FAILED_TO_RETRIEVE_PEN_REQ INTERNAL_SERVER_ERROR\r\n");
                return;
            }
            
            var toReturn = "PENDING_REQUESTS"
            
            //build up return string
            for (var i = 0, len = friends.length; i < friends.length; i++) {
              toReturn+= " " + friends[i]['user_b'];
            } 
            sock.emit('data',toReturn+'\r\n');
        });
    }else {
        sock.emit('data',"FAILED_TO_RETRIEVE_PEN_REQ NOT_LOGGED_IN\r\n")
    }
}

/**
* Gets and returns (through call back function) a list of all the friends the user has
* @function
* @param {stirng} username - the username to get the friends of
* @param {function} callback - the function to callback when sql server responds - returns with error object and list of friends
*/
function getFriends(username,callback) {

    //gets all friend rows with the user in them (on either side of frendship) and pending is false
    var query = "SELECT user_a, user_b FROM friends WHERE (user_a = '" + mysql.escape(username) +"' OR user_b = '" + mysql.escape(username) +"') AND pending = 0;"
    db.query(query,function(err,rows){
            if(err) {//send error to callback function
                callback(err,null);
            }else {
                var friends = [];
                /*
                * Algorithm for finding all friends:
                *   1) For each friend pairs:
                *   2)      Search after pair for opposite pair
                *   3)      if found: add user to list
                *   4)      if not found: do nothing (this case stops pending requests being counted as friends)
                * (note the second pair will not find the first pair =>each friendship found once)
                */
                for (var i = 0;i<rows.length;i++) {//for each row returned
                    currUserA = rows[i]['user_a'];
                    currUserB = rows[i]['user_b'];
                    
                    for (var j = i+1;j<rows.length;j++) {//find matched row
                        if (currUserA === rows[j]['user_b'] && currUserB === rows[j]['user_a']) {
                           
                            if (currUserA.toLowerCase() == username.toLowerCase()) {//add user to list
                                friends.push(currUserB);
                            }else {
                                friends.push(currUserA);
                            }
                        }
                    }
                }
                callback(null,friends);
            }
    });
}

/**
* Allows clients to see a list of friends they have
* @function 
* @param {socket object} socket of user to get friends list of
*/
function seeFriends(sock) {
    if (loggedIn(sock)) {//only useable by logged in clients
    
        //get friends
        getFriends(dict[sock.id],function(err,friends) {//note: friends is a list of friends not raw SQL results
            
            if (err) {//lof error and inform client
                console.log(err);
                sock.emit('data',"FAILED_TO_RETRIEVE_FRIENDS INTERNAL_SERVER_ERROR\r\n");
                return;
            }
            
            var toReturn = "FRIENDS"
            
            //build up response
            for (var i = 0, len = friends.length; i < friends.length; i++) {
              toReturn+= " " + friends[i];
            } 
            sock.emit('data',toReturn+'\r\n');
        });
    }else {
        sock.emit('data',"FAILED_TO_RETRIEVE_FRIENDS NOT_LOGGED_IN\r\n")
    }
}

/**
* Returns true if socket is logged in, false if not
* @function
* @param {socket object} sock - the socket to see if is logged in
*/
function loggedIn(sock) {
    return !dict[sock.id] == 0; 
}

/**
* Returns(through callback function) the user details of a given user
* @function
* @param {string} username - username of user to get details of
* @param {function} callback - function to call when sql server responds, called with error and rows objects
*/
function getUserDetails(username, callback) {    
    var query = "SELECT * FROM users WHERE username = '" + mysql.escape(username) +"';"
    db.query(query,function(err,rows){
          if(err) {
              callback(err,null);
          }else {
              callback(null,rows[0]);
          }
    });
}

/**
Called when a client attempts to log in
* @function
* @param {Socket} sock - the socket object that attempted to log in
* @param {String[]} args - String array with args[0] being 'Login' [1] the username and [2] the password
*/
function login(sock, args) {
    if (args.length == 3) { //basic validation check
        
        var username = args[1];
        var password = args[2];
        
        //don't let users log in twice - causes mapping issues see dict and reverseDict
        if (!loggedIn(sock)) {
            //get user details from server
            getUserDetails(username, function(err, user) {
                
                if (err) { //log error and inform client
                    console.log(err);
                    sock.emit('data',"LOGIN_FAILED INTERNAL_SERVER_ERROR\r\n");
                    return;
                }
                
                if (user != undefined) {//if there is a user found
                
                    //get hashed password of attempted login
                    var salt = user['salt']
                    hashedPassword = sha512(password,salt);
                    
                    //if correct pasword
                    if (hashedPassword == user['hashed_password']) {
                        sock.emit('data',"LOGIN_SUCCESSFUL "+username+ "\r\n");
                        dict[sock.id] = username;//assign socket to user
                        reverse_dict[username] = sock;
                    }else {
                        sock.emit('data',"LOGIN_FAILED INCORRECT_PASSWORD "+username+ "\r\n");
                    }
                }else {
                    sock.emit('data',"LOGIN_FAILED USERNAME_NOT_FOUND "+username+ "\r\n");
                }
            });
        }else {
            sock.emit('data',"LOGIN_FAILED ALREADY_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"LOGIN_FAILED INVALID_USE_OF_COMMAND\r\n");
    }
}

/**
* Validates the input string as a valid email
* @function 
* @param {String} email - the email to validate
* NOTE: The regex used in this function was taken from: http://pietschsoft.com/post/2015/09/05/JavaScript-Basics-How-to-create-a-Dictionary-with-KeyValue-pairs
*/
function validateEmail(email) {
    if (email.length<=255) {
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email);
    }else {
        return false;
    }
}

/**
* Validates the input string as a valid username
* @function 
* @param {String} username - the username to validate
*/
function validateUsername(username) {
    return (username.length >= 4) && (username.length <= 50) && /^\w+$/.test(username);
}

/**
* Validates the input string as a valid password
* @function 
* @param {String} username - the username to validat
*/
function validatePass(password) {
    return (password.length >= 8) && (password.length <= 50) && /^\w+$/.test(password);
}

/**
* Returns (through callback function) true if username is free, false otherwise
* @function
* @param {String} username - username to check 
* @param {function} callback - function to callback when server responds
*/
function isUsernameFree(username, callback) { 
   
    var query = "SELECT username FROM users WHERE username = '" + mysql.escape(username) +"';"
    db.query(query,function(err,rows){
        
          if(err) {//report error to callback function
              callback(err,null);
          }else {
              var toReturn = false;
              if (rows.length == 0) {//no results => username is free
                toReturn = true;
              }
              callback(null,toReturn);
          }
        });
}

/**
* Returns (through callback function) true if email is free, false otherwise
* @function
* @param {String} email - email to check 
* @param {function} callback - function to callback when server responds
*/
function isEmailFree(email, callback) {
    var query = "SELECT username FROM users WHERE email = '" + mysql.escape(email) +"';"
    db.query(query,function(err,rows){
        if(err) {//throw to callback function
            callback(err,null);
        }else {
            var toReturn = false;
            if (rows.length == 0) {
             toReturn = true;
            }
            callback(null,toReturn);
        }
    });
}

/**
* Function to create a random alph-numeric string of 100 chars
* NOTE: this function was modified from function found here: 
* http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
* @function
*/
function generateSalt() {
    var salt = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 100; i++ ) {//100 chars of random data
        salt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return salt;
}

/**
 * Hash password with sha512.
 * NOTE: This function is modified from function found here: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 * @function
 * @param {string} password - The password to hash
 * @param {string} salt - Salt to hash the password with
 */
var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return value = hash.digest('hex');
};

/**
* Adds an account into the database
* @function
* @param {String} email          - the email of the user to add
* @param {String} username       - the username of the user to add
* @param {String} hashedPassword - the hashed password of the user to add
* @param {String} salt           - the salt used in generating hash
*/
function addAccountToDB(email, username, hashedPassword, salt) {
    var query = 'INSERT INTO users (email, username, hashed_password, salt, pending_friend_request) VALUES ' +
    
    "('" + mysql.escape(email) + "','" + mysql.escape(username) + "','" + mysql.escape(hashedPassword) + "','"+ salt + "'," + "false" + ')';
    
    db.query(query,function(err){
          if(err) {
              console.log("error");
                throw err;
          }
    });
}

/**
* Attempts to create a new account validating each part and responding to the client
* @function
* @param {socket object} sock - The coket trying to create a new user account
* @param {String[]} args - The create accoount command from the client
*/
function createAccount(sock, args) {
    
    if (args.length == 4) {//basic validation check
        
        //don't let users create account if logged in, causes mapping issues - see dict and reverseDict
        if (!loggedIn(sock)) {
            email       = args[1];
            username    = args[2];
            password    = args[3];
            
            if (validateEmail(email)) { //if email valid
            
                if (validateUsername(username)) { //if username valid
                    
                    if (validatePass(password)) { //if password valid
                        
                        //check username is not already in use
                        isUsernameFree(username,function (err,free){
                            
                            if (err) {//log error and send to client
                                console.log(err);
                                sock.emit('data',"ACCOUNT_NOT_CREATED INTERNAL_SERVER_ERROR\r\n");
                                return;
                            }else if (!free) { //username taken
                                sock.emit('data',"ACCOUNT_NOT_CREATED USERNAME_TAKEN " + username + "\r\n");
                            }else {
                                
                                //check email is not already attached to a client
                                isEmailFree(email, function(err, free) {
                                    
                                    if (err) {//log error and send to client
                                        console.log(err);
                                        sock.emit('data',"ACCOUNT_NOT_CREATED INTERNAL_SERVER_ERROR\r\n");
                                        return;
                                    }else if (!free) {//email taken already
                                        sock.emit('data',"ACCOUNT_NOT_CREATED EMAIL_ALREADY_HAS_ACCOUNT " + username + "\r\n");
                                    }else {
                                        
                                        var salt = generateSalt();
                                        var hashedPass = sha512(password, salt);
                                        
                                        addAccountToDB(email, username, hashedPass,salt);
                                        
                                        dict[sock.id] = username; //mark socket as logged in
                                        reverse_dict[username] = sock;
                                        sock.emit('data',"ACCOUNT_CREATED "+username+"\r\n");
                                        return;
                                    }
                                });
                            }
                        }); 
                    }else {
                        sock.emit('data',"ACCOUNT_NOT_CREATED PASSWORD_INVALID " + username + "\r\n");
                    }
                }else {
                    sock.emit('data',"ACCOUNT_NOT_CREATED USERNAME_INVALID "+ username + "\r\n");
                }
            }else {
                sock.emit('data',"ACCOUNT_NOT_CREATED EMAIL_INVALID "+ username + "\r\n");
            }
        }else {
             sock.emit('data',"ACCOUNT_NOT_CREATED ALREADY_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"ACCOUNT_NOT_CREATED INVALID_USE_OF_COMMAND\r\n");
    }
}

//---------------------------------------------------------GROUP STUFF--------------------------------------------


/**
* Creates a group in the database, with the given name with the given user id
* The time perameters are all set to system time
* @function
* @param {String} name      - The name of the group to create
* @param {String} owner_id  - The id of the user creating the group
*/
function createGroupDB(name,owner_id) {
    var query = 'INSERT INTO trips (owner_id, name, start_date, end_date, last_update) VALUES ' +
    "('" + mysql.escape(owner_id) + "','" + mysql.escape(name) + "', NOW(),NOW(),NOW())";
    db.query(query,function(err){
      if(err) {
          console.log("error");
          throw err;
      }
    });
} 

/**
* Attempts to create a new group validating each part and responding to the client
* @function
* @param {socket object} sock - The socket trying to create a new group
* @param {String[]} args - The create group command from the client
* TODO return ID to client aswell
*/
function createGroup(sock, args) {
    if (args.length == 2) {//basic validation check
    
        if (loggedIn(sock)) {
            var groupName = args[1];
            var username = dict[sock.id];
     
            //get user id of the user
            getUserDetails(username, function(err, user) {
                
                if (err) { //log error and inform client
                    console.log(err);
                    sock.emit('data',"GROUP_NOT_CREATED INTERNAL_SERVER_ERROR\r\n");
                    return;
                }
                
                if (user != undefined) {//if there is a user found
                    
                    var id = user['user_id'];
                    createGroupDB(groupName,id);//create group
                    sock.emit('data',"GROUP_CREATED "+groupName+"\r\n");
                    
                }else {
                   console.log(err);
                   sock.emit('data',"GROUP_NOT_CREATED INTERNAL_SERVER_ERROR\r\n");
                   return; 
                }
            });
            
        }else {
             sock.emit('data',"GROUP_NOT_CREATED NOT_LOGGED_IN\r\n");
        }
   }else {
      sock.emit('data',"GROUP_NOT_CREATED INVALID_USE_OF_COMMAND\r\n"); 
   }
}

/*
* Gets (using callback) the groups that a user is the owner of or is a 
* member of.
* @function
* @param {int} id - The id of the user to get groups of
* @param {function({error object},{sql rows})} callback - The function to call when results found
*/
function getGroupsDB(id,callback) {
    var query = "SELECT * FROM trips WHERE trips.owner_id = "+mysql.escape(id)+ " AND deleted = 0;";
 
    db.query(query,function(err,rows){
        
        var query2 = "SELECT trips.* "
        +" FROM trips, user_document_link"
        +" WHERE user_document_link.user_id = "+mysql.escape(id)
            +" AND user_document_link.trip_id = trips.trip_id"
            +" AND user_document_link.active = 1  AND trips.deleted = 0;";
        
        db.query(query2,function(err,rows2){
            callback(err,rows.concat(rows2));
        });
    });
}

/**
* Returns (through callback function) rows of trip id's
* Each id is of a trip that the user has a pending request from
* @function 
* @param {int} user_id - the id of the user
* @param {function} callback - the function to callback when sql server responds
*/
function getPendingGroupsDB(user_id,callback) {
    var query = "SELECT * FROM trips, user_document_link WHERE "+
    "user_document_link.user_id = '"+mysql.escape(user_id)+"' AND user_document_link.active = 0 " +
    "AND user_document_link.trip_id = trips.trip_id AND trips.deleted = 0;"
    db.query(query,function(err,rows){
      callback(err,rows);
    });
}

/**
* Attempts to respond to client asking for a list of trip id's 
* for either pending requests or active groups
* depending on the pending flag.
* @function
* @param {socket object} sock - the socket requesting command
* @param {string[]} args - the arguments provided by the client
* @param {boolean} pending - true if oending group are wanted, 
*                            false if member groups are wanted
* @return list direclty over socket
*/
function seeGroups(sock,args,pending) {
    if (loggedIn(sock)) {
        var username = dict[sock.id];
     
        getUserDetails(username, function(err, user) {
            
            if (err) { //log error and inform client
                console.log(err);
                sock.emit('data',"LIST_NOT_RETRIEVED INTERNAL_SERVER_ERROR\r\n");
                return;
            }
                
                
            if (user != undefined) {//if there is a user found
                var id = user['user_id'];
                if (!pending) {
                    getGroupsDB(id,function(err,rows) {
                        
                        if (err) { //log error and inform client
                            console.log(err);
                            sock.emit('data',"LIST_NOT_RETRIEVED INTERNAL_SERVER_ERROR\r\n");
                            return;
                        }
                
                        var toReturn = "GROUPS"
                       
                        //build up response
                        for (var i = 0, len = rows.length; i < rows.length; i++) {
                          toReturn+= " " + rows[i].name +'(' + rows[i].trip_id+')';
                        } 
                        sock.emit('data',toReturn+'\r\n');
                    });
                }else {
                    getPendingGroupsDB(id,function(err,rows) {
                        
                        if (err) { //log error and inform client
                            console.log(err);
                            sock.emit('data',"LIST_NOT_RETRIEVED INTERNAL_SERVER_ERROR\r\n");
                            return;
                        }
                
                        var toReturn = "PENDING_GROUPS"
                
                        //build up response
                        for (var i = 0, len = rows.length; i < rows.length; i++) {
                          toReturn+= " " + rows[i].name + '(' + rows[i].trip_id + ')';
                        } 
                        
                        sock.emit('data',toReturn+'\r\n');
                    });
                }
            }else {
               console.log(err);
               sock.emit('data',"LIST_NOT_RETRIEVED INTERNAL_SERVER_ERROR\r\n");
               return; 
            }
        });
    }else {
        sock.emit('data',"LIST_NOT_RETRIEVED NOT_LOGGED_IN\r\n");
    }
}

/**
* Returns (through callback) true if given user has an invite
* from the given group
* @function 
* @param {int} friend_id - the user id to check 
* @param {int} group_id - the group id to check
* @param {function} callback - function to callback
* @return true if given user has a pending invite to pending group,
* false otherwise
*/
function pendingGroups(friend_id, group_id, callback) {
    query = "SELECT active FROM user_document_link WHERE user_id = '"+mysql.escape(friend_id)+"' AND trip_id = "+mysql.escape(group_id)+";";
    
    db.query(query,function(err,rows) {
        if (err || rows.length == 0) {
            callback(err,null);
        }else {
            if (rows[0].active == 0) {
                callback (false,true);
            }else {
                callback (false,false);
            }
        }
    });
}

/*
* Adds a user to group in the database
* callback called with error object
*/
function addToGroupDB(person_id, group_id, friend_id, callback) {
    query = "INSERT INTO user_document_link (user_id, trip_id, active) VALUES"
          + " ('" + mysql.escape(friend_id) + "','"+ mysql.escape(group_id) + "','0');";
    db.query(query,function(err) {
        callback(err);
    });
}

/*
* Gets user details from database
* returns sql row through callback function
*/
function getUser_id(username,callback) {
    query = "SELECT user_id FROM users WHERE username = '"+mysql.escape(username)+"';";
    db.query(query,function(err,rows) {
        
        if (err || rows.length == 0) {
            callback(-1);
        }else {
            callback (rows[0].user_id);
        }
    });
}

/*
* Returns true (through callback) if the given id is a group identify
* false otherwise
*/
function isGroupID(id,callback) {
    query = "SELECT * FROM trips WHERE trip_id = '"+mysql.escape(id)+"';";
    db.query(query,function(err,rows) {
        
        if (err || rows.length == 0) {
            callback(false);
        }else {
            callback (true);
        }
    });
}

/*
* Returns true (through callback) if given user is the 
* owner of the given group, false otherwise
*/
function isOwnerOfGroup(group_id,user_id,callback) {
    query = "SELECT * FROM trips WHERE trip_id = '"+mysql.escape(group_id)+"' AND owner_id = '" + user_id + "';";
    
    db.query(query,function(err,rows) {
        if (err || rows.length == 0) {
            callback(false);
        }else {
            callback (true);
        }
    });
}

/*
* Returns true (through callback) if given document is owned
* by the given user, false otherwise
*/
function isOwnerOfDoc(doc_id,user_id,callback) {
    query = "SELECT * FROM documents WHERE document_id = '"+mysql.escape(doc_id)+"' AND owner_id = '" + user_id + "';";
    
    db.query(query,function(err,rows) {
        if (err || rows.length == 0) {
            callback(false);
        }else {
            callback (true);
        }
    });
}

/*
* Adds a friend to a group based off client command
*/
function addFriendToGroup(sock,args) {
    if (args.length == 3) {//basic validation check
    
        if (loggedIn(sock)) {
            var groupID = args[1];
            var username = dict[sock.id];
            var friendName = args[2];
            
            getUser_id(username,function (user_id) {
                
                if (user_id == -1) {
                    console.log("Error user id not found?");
                    sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                }else {
                    getUser_id(friendName,function (friend_id) {
                        if (friend_id == -1) {
                            sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND FRIEND_NOT_FOUND\r\n');
                        }else {
                            
                            if (username == friendName) {
                                sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND CANNOT_ADD_SELF\r\n');
                                return;
                            }
                            
                            friends(username,friendName,function(err,friends) {
                                if (err) {//log error and inform client of error
                                    console.log(err);
                                    sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                                    return;
                                }
                        
                                if (friends) {//user's are already friends
                                    
                                    isGroupID(groupID,function (valid) {//valid group
                                    
                                        if (!valid) {
                                            sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND GROUP_NOT_FOUND ' + groupID + '\r\n');
                                            return;
                                        }
                                    
                                        //check there isn't already a friend request
                                        pendingGroups(friend_id,groupID,function(err,pending){
                                            
                                            if (err) {//log error and inform client of error
                                                console.log(err);
                                                sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND INTERNAL_SERVER_ERROR\r\n');
                                                return;
                                            }
                                            
                                            if (pending) {//there is already a request
                                               
                                               sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND REQUEST_ALREADY_SENT\r\n');
                                               
                                            }else {
                                                //only owner can add people to group
                                                isOwnerOfGroup(groupID,user_id,function(valid) {
                                                    
                                                    if (valid) {
                                                        addToGroupDB(user_id, groupID, friend_id,function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                                sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND ALREADY_ON_TRIP\r\n');
                                                            }else {
                                                                sock.emit('data','GROUP_REQUEST_SENT '+args[2] +'\r\n');
                                                            }
                                                        });
                                                        
                                                    }else {
                                                        sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND NOT_AUTHORISED ' + args[1] +'\r\n');
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }else {
                                    sock.emit('data','GROUP_REQUEST_FAILED_TO_SEND CAN_ONLY_ADD_FRIENDS' + args[1] +'\r\n');
                                    return;
                                }
                            });
                            
                        }
                        
                    });
                }
                
            });
        }else {
            sock.emit('data',"GROUP_REQUEST_FAILED_TO_SEND NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"GROUP_REQUEST_FAILED_TO_SEND INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Accepts a pending user to a group in the database
*/
function acceptGroupRequestDB(user_id, group_id) {
    query = "UPDATE user_document_link SET active = 1 WHERE user_id = '" + mysql.escape(user_id)+ "' AND trip_id = '" + group_id +"';";
    db.query(query);
}

/*
* Handles a client requesting to accept a pending trip request
*/
function acceptGroupRequest(sock,args) {
    if (args.length == 2) {//basic validation check
    
        if (loggedIn(sock)) {
            group_id = args[1];
            username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
                
                if (user_id == -1) {
                    sock.emit('data',"GROUP_REQUEST_NOT_ACCEPTED INTERNAL_SERVER_ERROR\r\n");
                    return;
                }
                
                isGroupID(group_id,function (valid) {
                    
                    if (!valid) {
                        sock.emit('data',"GROUP_REQUEST_NOT_ACCEPTED GROUP_NOT_FOUND " + group_id + "\r\n");
                        return;
                    }
                    
                    pendingGroups(user_id,group_id,function(err,pending){
                        
                        if (!pending) {
                            sock.emit('data',"GROUP_REQUEST_NOT_ACCEPTED NO_REQUEST_FOUND " + group_id + "\r\n");
                            return;  
                        }else {
                            acceptGroupRequestDB(user_id,group_id);
                            sock.emit('data',"GROUP_REQUEST_ACCEPTED " + group_id + "\r\n");
                        }
                    });
                });
            });
            
        }else {
            sock.emit('data',"GROUP_REQUEST_NOT_ACCEPTED NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"GROUP_REQUEST_NOT_ACCEPTED INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Adds a document metadata to the database
*/
function addDocumentToDB(user_id,group_id,doc_name) {
    query = "INSERT INTO documents (owner_id, trip_id, date, priority, category,"
    +" last_update, private, file_location, activity, name) VAlUES ("
    + "'" + mysql.escape(user_id)           + "',"
    + "'" + mysql.escape(group_id)          + "',"
    + "NOW()"                               +  ","
    + "'" + '1'                             + "',"
    + "'" + 'general'                       + "',"
    + "NOW()"                               +  ","
    + "'" + '0'                             + "',"
    + "'" + "No location"                   + "',"
    + "'" + '0'                             + "',"
    + "'" + mysql.escape(doc_name)        + "');";
    
    db.query(query);
}

/*
* Handles adding document requests by clients
*/
function addDocument(sock,args) {
    
    if (args.length == 3) {//basic validation check
    
        if (loggedIn(sock)) {
            var doc_name = args[1];
            var group_id  = args[2];
            var username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
            
                if (user_id == -1) {
                    sock.emit('data',"DOCUMENT_NOT_ADDED INTERNAL_SERVER_ERROR\r\n");
                    return;
                }
                
                isGroupID(group_id,function (valid) {
                  
                    if (!valid) {
                        
                        sock.emit('data',"DOCUMENT_NOT_ADDED GROUP_NOT_FOUND " + group_id + "\r\n");
                        return;
                    }else {
                        getGroupsDB(user_id,function(err,groups){
                            
                            valid = false;
                            for (i=0;i<groups.length;i++) {
                                if (groups[i].trip_id == group_id) {
                                    valid = true;
                                }
                            }
                            
                            if (!valid) {
                                sock.emit('data',"DOCUMENT_NOT_ADDED NOT_AUTHORISED " + group_id + "\r\n");
                                
                                return;
                            }else {
                                addDocumentToDB(user_id,group_id,doc_name);
                                   
                                sock.emit('data',"DOCUMENT_ADDED " + doc_name + "\r\n");
                            }
                        });
                    }
                });
            });
        }else {
        sock.emit('data',"DOCUMENT_NOT_ADDED NOT_LOGGED_IN\r\n");
    }
    }else {
        sock.emit('data',"DOCUMENT_NOT_ADDED INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Returns via callback, list of documents in the given group
*/
function getDocsInDatabase(group_id,callback) {
    query = "SELECT * FROM documents WHERE trip_id ="+mysql.escape(group_id)+ ' AND deleted = 0;';
    db.query(query,callback);
}

/*
* Returns via callback a documents meta data
*/
function getDocInDatabase(doc_id,callback) {
    query = "SELECT * FROM documents WHERE document_id ="+mysql.escape(doc_id)+';';
    db.query(query,callback);
}

/*
* Handles client request for seeing all documents in a group
*/
function getDocuementsInGroup(sock,args) {
    if (args.length == 2) {//basic validation check
    
        if (loggedIn(sock)) {
            username = dict[sock.id];
            group_id = args[1];
            
            getUser_id(username,function (user_id) {
            
                if (user_id == -1) {
                    sock.emit('data',"DOCUMENT_LIST_NOT_FOUND INTERNAL_SERVER_ERROR\r\n");
                    return;
                }else {
                    
                     getGroupsDB(user_id,function(err,groups){
                         if (err) {
                            sock.emit('data',"DOCUMENT_LIST_NOT_FOUND INTERNAL_SERVER_ERROR\r\n");
                            return;
                         }else {
                            valid = false;
                            for (i=0;i<groups.length;i++) {
                                if (groups[i].trip_id == group_id) {
                                    valid = true;
                                }
                            }
                            
                            if (!valid) {
                                sock.emit('data',"DOCUMENT_LIST_NOT_FOUND NOT_AUTHORISED\r\n");
                            }else {
                                getDocsInDatabase(group_id,function (err,docs) {
                                    
                                    if (err) {
                                        sock.emit('data',"DOCUMENT_LIST_NOT_FOUND INTERNAL_SERVER_ERROR\r\n");
                                    }else {
                                        toReturn = "DOCUMENTS";
                                        for (i=0;i<docs.length;i++) {
                                            toReturn+= " " + docs[i].name + '(' + docs[i].document_id +')' ;
                                        }
                                        sock.emit('data',toReturn + "\r\n");
                                    }
                                    
                                });
                            }
                         }
                         
                         
                     });
                }
            });
        }else {
            sock.emit('data',"DOCUMENT_LIST_NOT_FOUND NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"DOCUMENT_LIST_NOT_FOUND INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Handles a download request from a client
* Note: Only handles .txt files by parsing them over the socket
*/
function downloadDocument(sock,args) {
   
     if (args.length == 2) {//basic validation check
    
        if (loggedIn(sock)) {
            doc_id = args[1];
            username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
                
                if (user_id == -1) {
                    sock.emit('data',"DOWNLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                }else {
                    
                    getDocInDatabase(doc_id,function (err,docObject){
                        
                        if (err) {
                                sock.emit('data',"DOWNLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                console.log(err);
                                return;
                        }else {
                            group_id = docObject[0].trip_id;
                            
                            getGroupsDB(user_id,function(err,groups){
                                
                                if (err) {
                                    console.log(err);
                                    sock.emit('data',"DOWNLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                    return;
                                }else {
                                    valid = false;
                                    for (i=0;i<groups.length;i++) {
                                        if (groups[i].trip_id == group_id) {
                                            valid = true;
                                        }
                                    }
                                }
                                
                                if (!valid) {
                                    sock.emit('data',"DOWNLOAD_FAILED NOT_AUTHORISED\r\n");
                                }else {
                                    fileLocation = '/files/' + group_id + '/' + docObject[0].document_id + '.txt';
                                    
                                    fileLocation = path.join(__dirname, fileLocation); 
                                    
                                    var fs = require('fs');
                                    
                                    //if the file doesnt exist put an empty file there
                                    if (!fs.existsSync(fileLocation)){
                                        
                                        var dir = '/files/' + group_id + '/';
                                        dir = path.join(__dirname, dir);
                                        
                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir);
                                        }
                                        
                                        //code modified from: http://stackoverflow.com/questions/2496710/writing-files-in-node-js
                                        fs.writeFile(fileLocation, "", function(err) {
                                            if(err) {
                                                console.log(err);
                                            }else {
                                                fs.readFile(fileLocation, 'utf8', function(err, data) {
                                                    if (err) {
                                                        console.log(err);
                                                        console.log("This is the error");
                                                        sock.emit('data',"DOWNLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                                    }else {
                                                        sock.emit('data',"DOWNLOAD_SUCCEEDED " + data.replace(/ /g,'_') + "\r\n");
                                                    }
                                                });
                                            }
                                        }); 
                                    }else {
                                        fs.readFile(fileLocation, 'utf8', function(err, data) {
                                            if (err) {
                                                console.log(err);
                                                sock.emit('data',"DOWNLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                            }else {
                                                sock.emit('data',"DOWNLOAD_SUCCEEDED " + data.replace(/ /g,'_') + "\r\n");
                                            }
                                        });
                                    }
                                }
                            });     
                        } 
                    });
                    
                }
            });
        }else {
            sock.emit('data',"DOWNLOAD_FAILED NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"DOWNLOAD_FAILED INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Handles client request to upload a document 
* Note: Only handle .txt files by parsing over the socket
*/
function uploadDocument(sock,args) {
    if (args.length == 3) {//basic validation check
        if (loggedIn(sock)) {
            doc_id = args[1];
            text   = args[2];
            username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
                
                if (user_id == -1) {
                    sock.emit('data',"UPLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                }else {
                    getDocInDatabase(doc_id,function (err,docObject) {
                        
                         if (err) {
                                sock.emit('data',"UPLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                console.log(err);
                                return;
                        }else {
                            if (docObject.length == 0) {
                                sock.emit('data',"UPLOAD_FAILED DOCUMENT_NOT_FOUND\r\n");
                            }else {
                                getGroupsDB(user_id,function(err,groups){
                                
                                    if (err) {
                                        console.log(err);
                                        sock.emit('data',"UPLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                        return;
                                    }else {
                                        valid = false;
                                        for (i=0;i<groups.length;i++) {
                                            if (groups[i].trip_id == docObject[0].trip_id) {
                                                valid = true;
                                            }
                                        }
                                        
                                        if (!valid) {
                                            sock.emit('data',"UPLOAD_FAILED NOT_AUTHORISED\r\n");
                                        }else {
                                            fileLocation = '/files/' + docObject[0].trip_id + '/' + docObject[0].document_id + '.txt';
                                            
                                            fileLocation = path.join(__dirname, fileLocation); 
                                            
                                            var fs = require('fs')
                                            //code modified from: http://stackoverflow.com/questions/2496710/writing-files-in-node-js
                                            fs.writeFile(fileLocation, text, function(err) {
                                                if(err) {
                                                    console.log(err);
                                                    sock.emit('data',"UPLOAD_FAILED INTERNAL_SERVER_ERROR\r\n");
                                                }else {
                                                    sock.emit('data',"DOCUMENT_UPLOADED " + docObject[0].name +"\r\n");
                                                }
                                            }); 
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
            
        }else {
            sock.emit('data',"UPLOAD_FAILED NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"UPLOAD_FAILED INVALID_USE_OF_COMMAND\r\n");
    }
}

/**
* Deletes a document from the database by setting the deleted flag to true
*/
function deleteDocInDB(doc_id,callback) {
    var query = "UPDATE documents SET deleted = 1 WHERE document_id ="+mysql.escape(doc_id)+";";
    db.query(query,callback);
}

/*
* Handles delete document request from clinet
*/
function deleteDocument(sock,args) {
    if (args.length == 2) {//basic validation check
        if (loggedIn(sock)) {
            doc_id = args[1];
            username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
            
                if (user_id == -1) {
                    sock.emit('data',"DOCUMENT_DELETE_FAILED INTERNAL_SERVER_ERROR\r\n");
                }else {
            
                    isOwnerOfDoc(doc_id,user_id,function (owner) {
                       
                        if (!owner) {
                            sock.emit('data',"DOCUMENT_DELETE_FAILED NOT_AUTHORISED\r\n");
                        }else {
                            deleteDocInDB(doc_id,function(err) {
                               if (err) {
                                   sock.emit('data',"DOCUMENT_DELETE_FAILED NOT_AUTHORISED\r\n");
                                   
                               }else {
                                   sock.emit('data',"DOCUMENT_DELETED "+doc_id+"\r\n");
                                   
                               }
                            });
                        }
                    });
                }
            
            });
        }else {
            sock.emit('data',"DOCUMENT_DELETE_FAILED NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"DOCUMENT_DELETE_FAILED INVALID_USE_OF_COMMAND\r\n");
    }
}

/*
* Deletes a trip from the database by setting the trip deleted flag to true
*/
function deleteGroupInDB(trip_id,callback) {
    var query = "UPDATE trips SET deleted = 1 WHERE trip_id ="+mysql.escape(trip_id)+";";
    db.query(query,callback);
}

/*
* Handles client request to delete a trip
*/
function deleteTrip(sock,args) {
    if (args.length == 2) {//basic validation check
        if (loggedIn(sock)) {
            trip_id = args[1];
            username = dict[sock.id];
            
            getUser_id(username,function (user_id) {
            
                if (user_id == -1) {
                    sock.emit('data',"GROUP_DELETE_FAILED INTERNAL_SERVER_ERROR\r\n");
                }else {
            
                    isOwnerOfGroup(trip_id,user_id,function (owner) {
                       
                        if (!owner) {
                            sock.emit('data',"GROUP_DELETE_FAILED NOT_AUTHORISED\r\n");
                        }else {
                            deleteGroupInDB(trip_id,function(err) {
                               if (err) {
                                   sock.emit('data',"GROUP_DELETE_FAILED NOT_AUTHORISED\r\n");
                               }else {
                                   sock.emit('data',"GROUP_DELETED "+trip_id+"\r\n");
                               }
                            });
                        }
                    });
                }
            
            });
        }else {
            sock.emit('data',"GROUP_DELETE_FAILED NOT_LOGGED_IN\r\n");
        }
    }else {
        sock.emit('data',"GROUP_DELETE_FAILED INVALID_USE_OF_COMMAND\r\n");
    }
}
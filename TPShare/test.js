var address = "http://82.40.178.16:6969";

var io = require('socket.io-client');

var socket = io(address,{ jsonp: false,transports: ['websocket'] });


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});




//print to cmd when a connection is established
socket.on('connect', function () { 
    rl.question("Connected to server, send:", (answer) => {
        socket.emit('data',answer);
    });
});


socket.on('data',function(data) {
    rl.question('From server "'+data+'", send:', (answer) => {
        socket.emit('data',answer);
    });
});

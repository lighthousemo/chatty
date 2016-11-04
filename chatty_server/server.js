// server.js

const express       = require('express');
const SocketServer  = require('ws').Server;
const uuid          = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Keep track of connected users
let connectedUsers  = 0;
const USERS         = [];  // remove unused variable
// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

// ----------------------------------------------------------------------------

SocketServer.prototype.broadcast = function broadcast(data) {
  this.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
};


// ----------------------------------------------------------------------------

function isUserConnect(connected) {

  // Connected/Disconectes notifications
  const newNotification = {};
  newNotification.id    = uuid.v1();
  newNotification.type  = 'incomingNotification';
  newNotification.content =  connected ? 'An user connected!' : 'An user disconnected!';
  // ^ cool little enhancement :)

  wss.broadcast(newNotification);

  // Counting users connected
  connected ? connectedUsers++ : connectedUsers--;
  const usersOnline = {
    type: 'usersOnline',
    content: connectedUsers
  }
  wss.broadcast(usersOnline);
}

// suggestion: you can break up this function into two to make the code easier to understand
//   userConnected()
//   userDisconnected()

// ----------------------------------------------------------------------------

wss.on('connection', (ws) => {

  // Counting connected users
  isUserConnect(true);

  // consider moving the code that generates a new random colour
  // into a separate function.
  const newColor = {
    type: 'newColor',
    content: '#'+Math.floor(Math.random()*16777215).toString(16)
  }

  ws.send(JSON.stringify(newColor));

  //USERS.push(ws);
  //console.log(USERS);


  ws.on('message', function incoming(data) {

    // Create Message
    let newMessage = JSON.parse(data);
    newMessage.id = uuid.v1();

    // Change type of message
    switch(newMessage.type) {
      case 'postNotification':
        newMessage.type = 'incomingNotification';
        break;

      case 'postMessage':
        newMessage.type = 'incomingMessage';
        break;
    }

    wss.broadcast(newMessage)
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => isUserConnect(false));
});
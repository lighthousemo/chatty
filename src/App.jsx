import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import Nav from './Nav.jsx';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // optional. if currentUser is not defined, it means the user is Anonymous
      currentUser: {
        //id: null
        name: "Bob",
      },
      messages: [],
      usersOnline: '...',
      styleName: "..."  // Is this always storing the color? 
                        // If yes, consider renaming the property to 'color'
    };

    // Global
    this.socket = {};
    this.sendMessage      = this.sendMessage.bind(this);
    this.postNotification = this.postNotification.bind(this);
    this.getMessageColor  = this.getMessageColor.bind(this);
  }

  // --------------------------------------------------------------------------
  // Send menssage to Client

  sendMessage(data) {

    const newMessage = {
      type: 'postMessage',
      username: this.state.currentUser.name,
      content: data.msg,
      color: this.state.styleName

    };

    this.socket.send(JSON.stringify(newMessage));
  }

  getMessageColor() {  // Is this function still being used?
    console.log('#FF0000');
  }

  // --------------------------------------------------------------------------
  // Show notification

  postNotification(data) {
    const new_username = data.username; // small style suggestion: rename new_username to newUsername to keep the naming consisten

    if(this.state.currentUser.name !== new_username){ // nice check here.
      const newNotification = {
        type: 'postNotification',
        content: `**${this.state.currentUser.name}** changed their name to **${new_username}**`
      } // architecture question: Should the content be determined on the client (React) or on the server?
        // What makes more sense conceptually?
        // In the case of the color, you decided to have the server determine the color.

      this.setState({currentUser: { name: new_username}})
      this.socket.send(JSON.stringify(newNotification));
    }
  }

  // --------------------------------------------------------------------------
  // When mounting

  componentDidMount() {
    console.log("componentDidMount <App />");

    // Connect to server
    this.socket = new WebSocket('ws://localhost:4000');

    // Refresh State
    this.socket.onmessage = (event) => {

      let data = JSON.parse(event.data);

      console.log(data);

      switch(data.type) {
        case 'incomingNotification': // Nice use of case statement here :)
        case 'incomingMessage':
          const messages = this.state.messages.concat(data);
          this.setState({messages: messages});
          break;

        case 'usersOnline':
          this.setState({usersOnline: data.content});
          break;

        case 'newColor':
          this.setState({styleName: data.content});
          break;


        default:
          console.error('Unknown type', data);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Rendering

  render() {
    return (
      <div>
        <Nav usersOnline={this.state.usersOnline}/>
        <MessageList messages={this.state.messages}></MessageList>
        <ChatBar
          sendMessage={this.sendMessage}
          postNotification={this.postNotification}
          currentUser={this.state.currentUser}
        > </ChatBar> <!-- style suggestion: move attributes on new line. it's more readable -->

      </div>
    );
  }
}
export default App;

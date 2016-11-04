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
      styleName: "..."
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

  getMessageColor() {
    console.log('#FF0000');
  }

  // --------------------------------------------------------------------------
  // Show notification

  postNotification(data) {
    const new_username = data.username;

    if(this.state.currentUser.name !== new_username){
      const newNotification = {
        type: 'postNotification',
        content: `**${this.state.currentUser.name}** changed their name to **${new_username}**`
      }

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
        case 'incomingNotification':
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
        <ChatBar sendMessage={this.sendMessage} postNotification={this.postNotification} currentUser={this.state.currentUser}> </ChatBar>

      </div>
    );
  }
}
export default App;

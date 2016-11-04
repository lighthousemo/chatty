import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
      username: this.props.currentUser.name
    };

    this.updateMessage  = this.updateMessage.bind(this);
    this.enterMessage   = this.enterMessage.bind(this);

    this.updateUsername = this.updateUsername.bind(this);
    this.enterUsername   = this.enterUsername.bind(this);
  }

  // --------------------------------------------------------------------------
  // OnChangeEvent on input
  updateMessage(e) {
    this.setState({ newMessage: e.target.value });
  }

  // --------------------------------------------------------------------------
  // Verify if enter was pressed
  enterMessage(e) {
    if (e.key == 'Enter') {

      const data = {
        username: this.state.username_old, // this state value does not exist. did you mean this.state.username?
        msg: e.target.value
      }

      {this.props.sendMessage(data)}
    }
  }

  // --------------------------------------------------------------------------
  // Verify if enter was pressed

  enterUsername(e) {
    if (e.key == 'Enter') {
      const newNotification = {
        username:   e.target.value,
      }
      {this.props.postNotification(newNotification)}
    }
  }

  // --------------------------------------------------------------------------
  // OnChangeEvent on input

  updateUsername(e) {
    this.setState({username: e.target.value});
  }

  // --------------------------------------------------------------------------
  render() {
    return (
      <footer>

        <input id="username" type="text" placeholder="Your Name (Optional)"
            value    = {this.state.username}
            onChange = {this.updateUsername}
            onKeyPress = {this.enterUsername}
        />

        <input id="new-message" type="text"
        value      = {this.state.newMessage}
        onChange   = {this.updateMessage}
        onKeyPress = {this.enterMessage}

        placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}
export default ChatBar;

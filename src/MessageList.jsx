import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {

  render() {
    return (
      <div id="message-list">
      {
        this.props.messages.map(msg => {
          switch(msg.type) {
            case 'incomingMessage':
              return <Message key={msg.id} username={msg.username} message={msg.content} color={msg.color}></Message>

              case 'incomingNotification':
                return <div className="message system" key={msg.id}>{msg.content}</div>;
          }
        })
      }
      </div>
    );
  }
}
export default MessageList;
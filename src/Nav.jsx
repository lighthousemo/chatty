import React, {Component} from 'react';

class Nav extends Component {
  render() {
    return (
      <nav>
        <h1>Chatty</h1>
        <h2>Users Online: {this.props.usersOnline}</h2>
      </nav>
    );
  }
}
export default Nav;

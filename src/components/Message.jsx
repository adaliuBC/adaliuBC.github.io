//import React from 'react'
import { Component } from "react";

class Message extends Component {
    render() {
        return (

            <div className="message">
                <div className="message-user">{this.props.username}</div>
                <div className="message-text">{this.props.text}</div>
            </div>

        )
    }
}

export default Message
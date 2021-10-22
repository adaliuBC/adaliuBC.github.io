//import React from 'react'
import { Component } from "react";
import ReactDOM from 'react-dom'
import Message from "./Message";

class MessageList extends Component {

    // auto-rollup when new messages come in
    // need to test
    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this)
        node.scrollTop = node.scrollHeight
    }

    render() {
        return (
            <div className="message-list">
                {/* change index with messageToken?? */}
                {this.props.msgList.map((message, index) => {
                    return (
                        <Message key={index} username={message.username} text={message.text} />
                        
                    )
                })}
            </div>
        )
    }
}

export default MessageList
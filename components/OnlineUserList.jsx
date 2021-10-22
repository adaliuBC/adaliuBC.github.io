//import React from 'react'
import { Component } from "react";

class OnlineUserList extends Component {
    render() {
        return (
            <div className="online-users">
                <h2>Online users</h2>
                {this.props.usrList.map((user, index) => {
                    return (
                        <div key={index} className="user">
                            <div>{user}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default OnlineUserList
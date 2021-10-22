//import React from "react";
import { Component } from "react";
import axios from 'axios';

import "./App.css";

import MessageList from "./components/MessageList";
import OnlineUserList from "./components/OnlineUserList";
import DialogInput from "./components/DialogInput";
import LoginPage from "./components/LoginPage";

var url = "https://localhost:3001"
//var url = "https://chat.cs291.com"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      msgList: [],
      // msgList: DUMMY_DATA_msg,
      // usrList: DUMMY_DATA_usr,
      usrList: [],
      msgToken: "",
      strmToken: "",
      showChat: false
    }
    this.sendDialog = this.sendDialog.bind(this);
    this.sendUserPass = this.sendUserPass.bind(this);
    this.start_stream = this.start_stream.bind(this);
  }

  componentDidMount(){
    document.title = "CS291a Chat Client"
  }

  start_stream () {
      var stream = new EventSource(url + "/stream/" + this.state.strmToken);
      stream.addEventListener(
          "Disconnect",
          (event) => {
              //TODO:
              //close the stream
              //show the login part
              stream.close();
              var usrList = Array();
              var msgList = Array();
              this.setState({showChat: false});
              this.setState({usrList: usrList});
              this.setState({msgList: msgList});
          }
      );
      stream.addEventListener(
          "Join",
          (event) => {
              //update the onlineUser window
              //update the Msg window
              var usrList = this.state.usrList;
              var msgList = this.state.msgList;
              var data = JSON.parse(event.data);
              var usr = data.user;
              usrList.push(usr);
              var JoinMsg = "JOINED on " + data.created + usr;
              msgList.push({'username': usr, 'text': JoinMsg});
              this.setState({usrList: usrList});
              this.setState({msgList: msgList});  //TODO: set state in one???
          }
      )
      stream.addEventListener(
          "Message",
          (event) => {
              //TODO:
              //update the msg window
              var msgList = this.state.msgList;
              var data = JSON.parse(event.data);
              var usr = data.user;
              var MsgMsg = "SEND MESSAGE on " + data.created + ": " + data.message;
              msgList.push({'username': usr, 'text': MsgMsg});
              this.setState({msgList: msgList});
          }
      )
      stream.addEventListener(
          "Part",
          (event) => {
              //TODO:
              //update the msgList state msg window
              //update the online user window
              var usrList = this.state.usrList;
              var msgList = this.state.msgList;
              var data = JSON.parse(event.data);
              var usr = data.user;
              usrList = usrList.filter(item => item!==usr);
              var PartMsg = "DEPARTED on " + data.created;
              msgList.push({'username': usr, 'text': PartMsg});
              this.setState({usrList: usrList});
              this.setState({msgList: msgList});
          }
      )
      stream.addEventListener(
          "ServerStatus",
          (event) => {
              //TODO:
              //update the msgList state msg window
              var msgList = this.state.msgList;
              var data = JSON.parse(event.data);
              var StatusMsg = "ServerStatus" + data.status + data.created;
              msgList.push({'username': 'server', 'text': StatusMsg});
              this.setState({msgList: msgList});
          }
      )
      stream.addEventListener(
          "Users",
          (event) => {
              //TODO:
              //update the online users window
              var usrList = this.state.usrList;
              var data = JSON.parse(event.data);
              console.log(data.users);
              var usrList = JSON.parse(data.users);  //??? can I parse this as JSON???
              this.setState({usrList: usrList});
          }
      )
  }


  // need to write functions to connect to the backend
  // use axios

  // update DUMMY_DATA_msg message list from the server
  // this.setState({
  //   messages: [...this.state.messages, message]
  // })

  // this.currentUser = currentUser
  sendDialog = async (text) => {

    var update_msgToken = "";
    var form = new FormData();
    form.append("message", text);
    let headers = {
      headers: {
        "Authorization": "Bearer " + this.state.msgToken,
      }
    }
    const response = await axios.post(url + "/message", form, headers);
    if (response.status === 201){
      console.log(response.headers["token"]);
      update_msgToken = response.headers["token"];
      this.setState({
        msgToken: update_msgToken,
      })
    }
    else if (response.status === 409){
      update_msgToken = response.headers["token"];
      this.setState({
        msgToken: update_msgToken,
      })
    }
    else {
      alert("Error code: " + response.status)
    }
    // var request = new XMLHttpRequest();
    // request.open("POST", url + "/message");
    // request.setRequestHeader(
    //   "Authorization",
    //   "Bearer " + this.state.msgToken
    // );

    
    // request.onreadystatechange = function () {
    //   if (this.readyState != 4) {
    //     return;
    //   }
    //   if (this.status === 201){
    //     var token = request.getResponseHeader("token"); // "token" or "HTTP_token"???
    //     update_msgToken = token;
    //   }
    //   else {
    //     alert("Error: " + this.status);
    //   }

    // }


    //console.log("sendDialog", text)
  }

  sendUserPass = async (username, password) => {
    // console.log("sendUserPass", username, password)
    // backend authenticate login
    var update_msgToken = "";
    var update_strmToken = "";

    //var request = new XMLHttpRequest();
    var form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const response = await axios.post(url+'/login', form);
    if (response.status === 201) {
      console.log(response.data)
      update_msgToken = response.data["message_token"];
      update_strmToken = response.data["stream_token"];
    }
    else {
      alert("Error code: " + response.status);
    }

    this.setState({
      msgToken: update_msgToken,
      strmToken: update_strmToken,
      showChat: true
    });

    this.start_stream();  //??not sure if there is issue here
    
    // TODO: server url needs to be changed

    // request.open("POST", url + "/login"); // TODO: url -> server backend
    // request.onreadystatechange = function () {
    //     // console.log(this.responseType);
    //     // console.log(this.responseText);
    //     if (this.readyState != 4) {
    //         return;
    //     }
    //     if (this.status === 201) {
    //         const data = JSON.parse(this.responseText);
    //         update_msgToken = data.message_token;
    //         update_strmToken = data.stream_token;
    //     } else if (this.status === 403) {
    //         // username & password not matched
    //         alert("password does not match username");
    //     } else if (this.status === 409) {
    //         // already logged in/stream already open
    //         alert(username.value + "is already logged in");
    //     } else if (this.status === 422) {
    //         alert("invalid username/password format");
    //     } else {
    //         alert("error, how did you get here??");
    //     }
        
    // };
  }



  render() {
    //TODO: login -> components
    console.log('this.state.msgList:', this.state.msgList);
    console.log('this.state.usrList:', this.state.usrList);
    console.log('this.state.usrList:', this.state.showChat);

    let display;
    // already logged in
    if (this.state.showChat) {
      display = (
        <div className="App">
          <header className="ChatClient-header">
            <h1>CS291a Chat Client</h1>
          </header>
          <OnlineUserList usrList={this.state.usrList} />
          <MessageList msgList={this.state.msgList} />
          <DialogInput sendDialog={this.sendDialog} />
        </div>
      )
    }
    // login page
    else {
      display = (
        <LoginPage sendUserPass={this.sendUserPass} />
      )
    }

    return (
        <div>{display}</div>
    );
  }
}
export default App;

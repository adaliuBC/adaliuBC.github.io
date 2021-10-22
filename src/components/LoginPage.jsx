import { Component } from "react";

class LoginPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
        }
        this.handleUser = this.handleUser.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUser(event) {
        this.setState({
            username: event.target.value,
        })
    }

    handlePass(event) {
        this.setState({
            password: event.target.value,
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        // TODO: send user-pass to App.js to backend
        this.props.sendUserPass(this.state.username, this.state.password)
    }


    render() {
        return (
            <div className="login-form">
                <h1>Login</h1>
                <form   
                    onSubmit={this.handleSubmit} 
                    className="login-input-form">
                    <label>Username:</label>
                    <input
                        onChange={this.handleUser}
                        value={this.state.username}
                        type="text" />
                </form>
                <form   
                    onSubmit={this.handleSubmit} 
                    className="login-input-form">
                    <label>Password:</label>
                    <input
                        onChange={this.handlePass}
                        value={this.state.password}
                        type="text" />
                </form>
                
            </div>
        )
    }
}

export default LoginPage
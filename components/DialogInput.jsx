import { Component } from "react";

class DialogInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialog: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({
            dialog: event.target.value,
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log("current dialog box", this.state.dialog)
        // TODO: send dialog to App.js to backend
        this.props.sendDialog(this.state.dialog)
        this.setState({
            dialog: ''
        })
    }

    render() {
        return (
            <form   onSubmit={this.handleSubmit} 
                    className="dialog-input-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.dialog}
                    placeholder="Type your message here and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

export default DialogInput
import React from 'react'
import {Alert, Button, Glyphicon} from "react-bootstrap";
import Proptypes from "prop-types";

class OnlyForLoggedInUsers extends React.Component {
    render() {
        return this.props.isLoggedIn
            ? this.props.children
            : <Alert bsStyle="warning"
                     style={{marginLeft: 15, marginRight: 15, marginBottom: 5, textAlign: 'center'}}>
                <strong>{this.props.text}</strong>
                <br/>
                <Button bsStyle="primary" style={{marginTop: 10}} onClick={this.props.showLogin}
                        disabled={this.props.isLoggingIn}>
                    <Glyphicon glyph="log-in"/> Anmelden
                </Button>
            </Alert>
    }
}

OnlyForLoggedInUsers.propTypes = {
    text: Proptypes.string.isRequired,
    showLogin: Proptypes.func.isRequired,
    isLoggedIn: Proptypes.bool.isRequired,
    isLoggingIn: Proptypes.bool.isRequired,
};

export default OnlyForLoggedInUsers;
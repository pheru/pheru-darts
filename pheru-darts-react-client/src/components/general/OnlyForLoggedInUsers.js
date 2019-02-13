import React from 'react'
import {Alert, Button} from "react-bootstrap";
import Proptypes from "prop-types";
import {FaSignInAlt} from "react-icons/fa";

class OnlyForLoggedInUsers extends React.Component {
    render() {
        return this.props.isLoggedIn
            ? this.props.children
            : <Alert variant="warning"
                     style={{marginBottom: 5, textAlign: 'center'}}>
                <strong>{this.props.text}</strong>
                <br/>
                <Button variant="primary" style={{marginTop: 10}} onClick={this.props.showLogin}
                        disabled={this.props.isLoggingIn}>
                    <FaSignInAlt/> Anmelden
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
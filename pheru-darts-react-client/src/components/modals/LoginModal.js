import React from 'react'
import {Modal, Button, FormControl} from "react-bootstrap";

class LoginModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: ""
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleNameChange(value) {
        this.setState({name: value});
    }

    handlePasswordChange(value) {
        this.setState({password: value});
    }

    render() {
        return <Modal bsSize="small" backdrop='static' show={this.props.show} onHide={this.props.hide}>
            <Modal.Header style={{textAlign: 'center'}}>
                <Modal.Title>Anmelden</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center', paddingBottom: 0}}>
                <FormControl style={{marginBottom: 5}} type="text" value={this.state.name}
                             onChange={(e) => this.handleNameChange(e.target.value)}
                             placeholder="Benutzername" autoFocus/>
                <FormControl type="password" value={this.state.password}
                             onChange={(e) => this.handlePasswordChange(e.target.value)}
                             placeholder="Passwort"/>
                <Button bsStyle="link" onClick={() => {
                    this.props.hide();
                    this.props.showSignUp();
                }}>Registrieren</Button>
                {this.props.loginFailedMessage !== undefined &&
                <div style={{color: "red"}}>{this.props.loginFailedMessage}</div>
                }
            </Modal.Body>
            <Modal.Footer style={{textAlign: 'center'}}>
                <Button style={{width: 100}} bsStyle="primary" disabled={this.props.isLoggingIn}
                        onClick={() => {
                            this.props.login(this.state.name, this.state.password);
                            this.handleNameChange("");
                            this.handlePasswordChange("");
                        }}>
                    Anmelden
                </Button>
                <Button style={{width: 100}} bsStyle='primary' onClick={this.props.hide}
                        disabled={this.props.isLoggingIn}>
                    Abbrechen
                </Button>
            </Modal.Footer>
        </Modal>;
    }
}

LoginModal.propTypes = {};

export default LoginModal;

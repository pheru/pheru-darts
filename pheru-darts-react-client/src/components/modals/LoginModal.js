import React from 'react'
import {Button, FormControl, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import KeyUtil from "../../util/KeyUtil";

const initialState = {
    name: "",
    password: ""
};

class LoginModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show !== this.props.show
            && this.props.show === false) {
            this.setState(initialState);
        }
    }

    handleNameChange(value) {
        this.setState({name: value});
    }

    handlePasswordChange(value) {
        this.setState({password: value});
    }

    render() {
        // restoreFocus auf false, da sonst beim Öffnen des SignUpModals der Fokus verloren geht
        // (der LoginModal wird geschlossen und setzt den Fokus auf das zuletzt fokusierte Element)
        return <Modal restoreFocus={false} bsSize="small" backdrop='static' show={this.props.show}
                      onHide={this.props.hide}>
            <Modal.Body style={{textAlign: 'center', paddingBottom: 0}}>
                <Modal.Title style={{marginBottom: 10}}>Anmelden</Modal.Title>
                <FormControl style={{marginBottom: 5}} type="text" value={this.state.name}
                             onChange={(e) => this.handleNameChange(e.target.value)}
                             onKeyDown={KeyUtil.ifEnterKey(() => {
                                 if (!this.isLoginDisabled()) {
                                     this.doLogin();
                                 }
                             })}
                             placeholder="Benutzername" autoFocus/>
                <FormControl type="password" value={this.state.password}
                             onChange={(e) => this.handlePasswordChange(e.target.value)}
                             onKeyDown={KeyUtil.ifEnterKey(() => {
                                 if (!this.isLoginDisabled()) {
                                     this.doLogin();
                                 }
                             })}
                             placeholder="Passwort"/>
                <Button bsStyle="link" onClick={() => {
                    this.props.hide();
                    this.props.showSignUp();
                }}>Neu hier? Jetzt registrieren!</Button>
            </Modal.Body>
            <Modal.Footer style={{textAlign: 'center'}}>
                <Button style={{width: 100}} bsStyle="primary"
                        disabled={this.isLoginDisabled()}
                        onClick={() => this.doLogin()}>
                    Anmelden
                </Button>
                <Button style={{width: 100}} bsStyle='primary' onClick={this.props.hide}
                        disabled={this.props.isLoggingIn}>
                    Abbrechen
                </Button>
            </Modal.Footer>
        </Modal>;
    }

    isLoginDisabled() {
        return this.props.isLoggingIn || this.state.name === "" || this.state.password === "";
    }

    doLogin() {
        this.props.login(this.state.name, this.state.password);
    }
}

LoginModal.propTypes = {
    login: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    showSignUp: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired
};

export default LoginModal;

import React from 'react'
import {Modal, Button, FormControl} from "react-bootstrap";
import PropTypes from 'prop-types';
import {ifEnterKey} from "../../util/functionUtil";

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
            <Modal.Body style={{textAlign: 'center', paddingBottom: 0}}>
                <Modal.Title style={{marginBottom:10}}>Anmelden</Modal.Title>
                <FormControl style={{marginBottom: 5}} type="text" value={this.state.name}
                             onChange={(e) => this.handleNameChange(e.target.value)}
                             placeholder="Benutzername" autoFocus/>
                <FormControl type="password" value={this.state.password}
                             onChange={(e) => this.handlePasswordChange(e.target.value)}
                             onKeyDown={ifEnterKey(() => {
                                 if (!this.props.isLoggingIn) {
                                     this.props.login(this.state.name, this.state.password);
                                     this.handleNameChange("");
                                     this.handlePasswordChange("");
                                 }
                             })}
                             placeholder="Passwort"/>
                <Button bsStyle="link" onClick={() => {
                    this.props.hide();
                    this.props.showSignUp();
                }}>Registrieren</Button>
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

LoginModal.propTypes = {
    login: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    showSignUp: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired
};

export default LoginModal;

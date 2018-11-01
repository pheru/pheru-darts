import React from 'react'
import {Button, FormControl, Glyphicon, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import {ifEnterKey} from "../../util/functionUtil";

class SignUpModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            passwordRepeat: "",
            passwordsMatch: true
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
        this.clearInputFields = this.clearInputFields.bind(this);
    }

    handleNameChange(value) {
        this.setState({name: value});
    }

    handlePasswordChange(value) {
        let match = value === this.state.passwordRepeat;
        this.setState({password: value, passwordsMatch: match});
    }

    handlePasswordRepeatChange(value) {
        let match = value === this.state.password;
        this.setState({passwordRepeat: value, passwordsMatch: match});
    }

    clearInputFields() {
        this.setState({name: "", password: "", passwordRepeat: "", passwordsMatch: true});
    }

    render() {
        return <Modal bsSize="small" backdrop='static' show={this.props.show} onHide={this.props.hide}>
            <Modal.Body style={{textAlign: 'center'}}>
                <Modal.Title style={{marginBottom: 10}}>Registrieren</Modal.Title>
                <FormControl style={{marginBottom: 5}} type="text" value={this.state.name}
                             onChange={(e) => this.handleNameChange(e.target.value)}
                             placeholder="Benutzername" autoFocus/>
                <FormControl style={{marginBottom: 5}} type="password" value={this.state.password}
                             onChange={(e) => this.handlePasswordChange(e.target.value)}
                             placeholder="Passwort"/>
                <FormControl type="password" value={this.state.passwordRepeat}
                             onChange={(e) => this.handlePasswordRepeatChange(e.target.value)}
                             onKeyDown={ifEnterKey(() => {
                                 if (this.state.passwordsMatch && !this.props.isSigningUp) {
                                     this.props.signUp(this.state.name, this.state.password);
                                     this.clearInputFields();
                                 }
                             })}
                             placeholder="Passwort wiederholen"/>
                {!this.state.passwordsMatch &&
                <div style={{color: "red"}}>
                    <Glyphicon glyph="remove"/> Passwort muss übereinstimmen
                </div>
                }
            </Modal.Body>
            <Modal.Footer style={{textAlign: 'center'}}>
                <Button style={{width: 100}} bsStyle="primary"
                        disabled={!this.state.passwordsMatch || this.props.isSigningUp}
                        onClick={() => {
                            this.props.signUp(this.state.name, this.state.password);
                            this.clearInputFields();
                        }}>
                    Registrieren
                </Button>
                <Button style={{width: 100}} bsStyle='primary' onClick={this.props.hide}>Abbrechen</Button>
            </Modal.Footer>
        </Modal>;
    }
}

SignUpModal.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func.isRequired,
    isSigningUp: PropTypes.bool,
    signUp: PropTypes.func.isRequired
};

export default SignUpModal;

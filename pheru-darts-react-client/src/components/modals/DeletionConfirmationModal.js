import React from 'react'
import {Alert, Button, FormControl, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import Glyphicon from "react-bootstrap/es/Glyphicon";

const initialState = {
    name: "",
    password: "",
    nameMatch: false
};

class DeletionConfirmationModal extends React.Component {

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
        let match = this.props.name === value;
        this.setState({name: value, nameMatch: match});
    }

    handlePasswordChange(value) {
        this.setState({password: value});
    }

    render() {
        return <Modal backdrop='static' show={this.props.show} onHide={this.props.hide}>
            <Modal.Body style={{textAlign: 'center', paddingTop: 0, paddingBottom: 0}}>
                <h3>
                    <Glyphicon glyph="exclamation-sign" style={{color: "#d9534f"}}/>
                    <strong> Benutzerkonto endgültig löschen</strong>
                </h3>
                <Alert bsStyle="danger" style={{textAlign: 'center'}}>
                    Das Löschen Deines Benutzerkontos kann nicht rückgängig gemacht werden! <br/>
                    Um Dein Konto dennoch zu löschen, musst du Deinen Benutzernamen und Dein Passwort bestätigen.
                </Alert>
                <FormControl style={{marginBottom: 5}} type="text" value={this.state.name}
                             disabled={this.props.isDeleting}
                             onChange={(e) => this.handleNameChange(e.target.value)}
                             placeholder="Benutzername" autoFocus/>
                <FormControl style={{marginBottom: 5}} type="password" value={this.state.password}
                             disabled={this.props.isDeleting}
                             onChange={(e) => this.handlePasswordChange(e.target.value)}
                             placeholder="Passwort"/>
            </Modal.Body>
            <Modal.Footer style={{textAlign: 'center'}}>
                <Button style={{width: 100}} bsStyle="danger"
                        disabled={this.isButtonDisabled()}
                        onClick={() => this.props.deleteUser(this.state.password)}>
                    Löschen
                </Button>
                <Button style={{width: 100}} bsStyle='primary'
                        onClick={this.props.hide} disabled={this.props.isDeleting}>
                    Abbrechen
                </Button>
            </Modal.Footer>
        </Modal>;
    }

    isButtonDisabled() {
        return this.props.isDeleting || !this.state.nameMatch || this.state.password === "";
    }

}

DeletionConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    deleteUser: PropTypes.func.isRequired
};

export default DeletionConfirmationModal;
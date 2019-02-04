import React from 'react'
import {Alert, Button, ControlLabel, FormControl, Glyphicon} from "react-bootstrap";
import PropTypes from 'prop-types';
import DeletionConfirmationModal from "../../modals/DeletionConfirmationModal";
import DocumentUtil from "../../../util/DocumentUtil";

const TITLE = "Benutzereinstellungen";

class UserSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: props.userName !== undefined ? props.userName : "",
            currentPassword: "",
            newPassword: "",
            passwordRepeat: "",
            passwordsMatch: true,
            saveButtonDisabled: true,
            showDeletionConfirmationModal: false
        };
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
        this.saveButtonDisabled = this.saveButtonDisabled.bind(this);
        this.showDeletionConfirmationModal = this.showDeletionConfirmationModal.bind(this);
    }

    componentDidMount() {
        DocumentUtil.setTitlePrefix(TITLE);
    }

    handleUserNameChange(value) {
        this.setState({
            userName: value,
            saveButtonDisabled: this.saveButtonDisabled(this.state.currentPassword, this.state.passwordsMatch, value, this.state.newPassword)
        });
    }

    handleNewPasswordChange(value) {
        let match = value === this.state.passwordRepeat;
        this.setState({
            newPassword: value,
            passwordsMatch: match,
            saveButtonDisabled: this.saveButtonDisabled(this.state.currentPassword, match, this.state.userName, value)
        });
    }

    handleCurrentPasswordChange(value) {
        this.setState({
            currentPassword: value,
            saveButtonDisabled: this.saveButtonDisabled(value, this.state.passwordsMatch, this.state.userName, this.state.newPassword)
        });
    }

    handlePasswordRepeatChange(value) {
        let match = value === this.state.newPassword;
        this.setState({
            passwordRepeat: value,
            passwordsMatch: match,
            saveButtonDisabled: this.saveButtonDisabled(this.state.currentPassword, match, this.state.name, this.state.newPassword)
        });
    }

    saveButtonDisabled(currentPassword, passwordsMatch, userName, newPassword) {
        return currentPassword === ""
            || !passwordsMatch
            || (userName === this.props.userName && newPassword === "");
    }

    showDeletionConfirmationModal(show) {
        this.setState({showDeletionConfirmationModal: show});
    }

    render() {
        return <div>
            <DeletionConfirmationModal show={this.state.showDeletionConfirmationModal}
                                       hide={() => this.showDeletionConfirmationModal(false)}
                                       name={this.props.userName} isDeleting={this.props.isDeletingUser}
                                       deleteUser={this.props.deleteUser}/>
            <h3 style={{marginTop: 0}}><strong>{TITLE}</strong></h3>
            <ControlLabel>Benutzername ändern</ControlLabel>
            <FormControl type="text"
                         className="user-settings-input"
                         disabled={this.props.isDeletingUser || this.props.isModifyingUser}
                         value={this.state.userName}
                         onChange={(e) => this.handleUserNameChange(e.target.value)}
                         placeholder="Benutzername"/>
            <ControlLabel>Passwort ändern</ControlLabel>
            <FormControl type="password"
                         className="user-settings-input"
                         disabled={this.props.isDeletingUser || this.props.isModifyingUser}
                         value={this.state.newPassword}
                         onChange={(e) => this.handleNewPasswordChange(e.target.value)}
                         placeholder="Neues Passwort"/>
            <FormControl type="password"
                         className="user-settings-input"
                         disabled={this.props.isDeletingUser || this.props.isModifyingUser}
                         value={this.state.passwordRepeat}
                         onChange={(e) => this.handlePasswordRepeatChange(e.target.value)}
                         placeholder="Neues Passwort wiederholen"/>
            {!this.state.passwordsMatch &&
            <div style={{color: "red"}}>
                <Glyphicon glyph="remove"/> Passwort muss übereinstimmen
            </div>
            }
            <ControlLabel style={{marginTop: 15}}>Aktuelles Passwort bestätigen</ControlLabel>
            <FormControl type="password"
                         className="user-settings-input"
                         disabled={this.props.isDeletingUser || this.props.isModifyingUser}
                         value={this.state.currentPassword}
                         onChange={(e) => this.handleCurrentPasswordChange(e.target.value)}
                         placeholder="Aktuelles Passwort"/>
            <Button bsStyle="primary" style={{display: "block", margin: "auto auto 10px"}}
                    disabled={this.props.isDeletingUser || this.props.isModifyingUser || this.state.saveButtonDisabled}
                    onClick={() => this.props.modifyUser(
                        this.state.currentPassword,
                        this.state.userName === this.props.userName ? null : this.state.userName,
                        this.state.newPassword === "" ? null : this.state.newPassword
                    )}>
                Änderungen speichern
            </Button>

            <Alert bsStyle="danger" style={{marginTop: 25}}>
                <h3 style={{marginTop: 0}}><strong>Benutzerkonto löschen</strong></h3>
                <Button style={{display: "block", margin: "auto"}} bsStyle="danger" disabled={this.props.disabled}
                        onClick={() => this.showDeletionConfirmationModal(true)}>
                    Benutzer löschen
                </Button>
            </Alert>
        </div>
    }
}

UserSettings.propTypes = {
    userName: PropTypes.string.isRequired,
    isModifyingUser: PropTypes.bool.isRequired,
    isDeletingUser: PropTypes.bool.isRequired,
    modifyUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
};

export default UserSettings
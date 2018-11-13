import React from 'react'
import {Alert, Button, FormControl, Glyphicon, OverlayTrigger, Table, Tooltip, Well} from "react-bootstrap";
import {ifEnterKey} from "../util/functionUtil";
import PropTypes from "prop-types";
import StackLoader from "./loaders/StackLoader";

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.userName !== undefined ? props.userName : "",
            currentPassword: "",
            newPassword: "",
            passwordRepeat: "",
            passwordsMatch: true,
            userNameToPermit: "",
            permitButtonDisabled: true,
            playersInformation: Settings.mergeUsers(this.props.playableUsers, this.props.permittedUsers)
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUserNameToPermitChange = this.handleUserNameToPermitChange.bind(this);
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userName !== prevProps.userName
            || this.props.permittedUsers !== prevProps.permittedUsers
            || this.props.playableUsers !== prevProps.playableUsers
        ) {
            this.setState({
                name: this.props.userName !== undefined ? this.props.userName : "",
                playersInformation: Settings.mergeUsers(this.props.playableUsers, this.props.permittedUsers)
            });
        }
    }

    static mergeUsers(playableUsers, permittedUsers) {
        let playerInformation = playableUsers.map(user => (
            {
                id: user.id,
                name: user.name,
                playable: true,
                permitted: false
            }
        ));
        for (let i = 0; i < permittedUsers.length; i++) {
            let userInPlayableFound = false;
            for (let j = 0; j < playerInformation.length; j++) {
                if (permittedUsers[i].id === playerInformation[j].id) {
                    playerInformation[j].permitted = true;
                    userInPlayableFound = true;
                }
            }
            if (!userInPlayableFound) {
                playerInformation.push({
                    id: permittedUsers[i].id,
                    name: permittedUsers[i].name,
                    playable: false,
                    permitted: true
                });
            }
        }
        return playerInformation;
    }

    handleNameChange(value) {
        this.setState({name: value});
    }

    handleUserNameToPermitChange(value) {
        let buttonDisabled = value === undefined || value === null || value === "";
        this.setState({
            userNameToPermit: value,
            permitButtonDisabled: buttonDisabled
        });
    }

    handleNewPasswordChange(value) {
        let match = value === this.state.passwordRepeat;
        this.setState({newPassword: value, passwordsMatch: match});
    }

    handleCurrentPasswordChange(value) {
        this.setState({currentPassword: value});
    }

    handlePasswordRepeatChange(value) {
        let match = value === this.state.password;
        this.setState({passwordRepeat: value, passwordsMatch: match});
    }

    render() {
        return <div>
            {this.props.isLoggedIn
                ? this.createUserSettings()
                : <Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5, textAlign:'center'}}>
                    <strong>Einstellungen können nur von angemeldeten Benutzern vorgenommen werden</strong>
                    <br/>
                    <Button style={{marginTop: 10}} bsStyle="primary" onClick={this.props.showLogin}
                            disabled={this.props.isLoggingIn}>
                        <Glyphicon glyph="log-in"/> Anmelden</Button>
                </Alert>
            }
        </div>
    }

    createUserSettings() {
        return <div style={{textAlign: 'center'}}>
            {/*<div style={{marginBottom: 50}}>*/}
            {/*<h3 style={{marginLeft: 10, marginRight: 10}}><strong>Benutzer-Einstellungen</strong></h3>*/}
            {/*<Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5}}>*/}
            {/*<Glyphicon glyph="exclamation-sign"/> <strong>Ändern von Benutzer-Einstellungen noch nicht*/}
            {/*möglich</strong>*/}
            {/*</Alert>*/}
            {/*<div style={{marginLeft: 20, marginRight: 20}}>*/}
            {/*<strong>Benutzername ändern: </strong>*/}
            {/*<FormControl style={{marginBottom: 5, width: 300}} type="text"*/}
            {/*value={this.state.name}*/}
            {/*onChange={(e) => this.handleNameChange(e.target.value)}*/}
            {/*placeholder="Benutzername"/>*/}
            {/*<strong>Passwort ändern: </strong>*/}
            {/*<FormControl style={{marginBottom: 5, width: 300}} type="password"*/}
            {/*value={this.state.currentPassword}*/}
            {/*onChange={(e) => this.handleCurrentPasswordChange(e.target.value)}*/}
            {/*placeholder="Aktuelles Passwort"/>*/}
            {/*<FormControl style={{marginBottom: 5, width: 300}} type="password"*/}
            {/*value={this.state.newPassword}*/}
            {/*onChange={(e) => this.handleNewPasswordChange(e.target.value)}*/}
            {/*placeholder="Neues Passwort"/>*/}
            {/*<FormControl style={{marginBottom: 5, width: 300}} type="password"*/}
            {/*value={this.state.passwordRepeat}*/}
            {/*onChange={(e) => this.handlePasswordRepeatChange(e.target.value)}*/}
            {/*placeholder="Neues Passwort wiederholen"/>*/}
            {/*<Button bsStyle="primary" disabled={true}>Änderungen speichern</Button>*/}
            {/*<p/><strong>Benutzer löschen: </strong><p/>*/}
            {/*/!*TODO in Alert auslagern (Hinweis (inklusive Löschen von Statistiken) und PW-Bestätigung)*!/*/}
            {/*<div style={{color: "#d9534f"}}>*/}
            {/*<Glyphicon glyph="alert"/> Dieser Vorgang kann nicht rückgängig gemacht werden <Glyphicon*/}
            {/*glyph="alert"/>*/}
            {/*</div>*/}
            {/*<FormControl style={{marginBottom: 5, width: 300}} type="password"*/}
            {/*// value={this.state.password}*/}
            {/*// onChange={(e) => this.handlePasswordChange(e.target.value)}*/}
            {/*placeholder="Passwort bestätigen"/>*/}
            {/*<Button bsStyle="danger" disabled={true}>Benutzer löschen</Button>*/}
            {/*</div>*/}
            <h3 style={{marginTop: 0}}><strong>Spieler-Berechtigungen</strong></h3>
            <div>
                <p><strong>Hier siehst Du welche Spieler Dir erlaubt haben ein Spiel mit ihnen zu erstellen und
                    kannst einstellen wer dich in einem Spiel auswählen darf.</strong></p>
                <div style={{display: "inline-flex", marginBottom: 5}}>
                    <FormControl style={{width: 300, display: 'inline', marginRight: 5}} type="text"
                                 value={this.state.userNameToPermit}
                                 onChange={(e) => this.handleUserNameToPermitChange(e.target.value)}
                                 onKeyDown={ifEnterKey(() => {
                                         if (!this.state.permitButtonDisabled && !this.props.isUpdatingPlayerPermission) {
                                             this.props.addPlayerPermissionByName(this.state.userNameToPermit)
                                         }
                                     }
                                 )}
                                 placeholder="Spieler berechtigen"/>
                    <Button bsStyle="success"
                            disabled={this.state.permitButtonDisabled || this.props.isUpdatingPlayerPermission}
                            onClick={() => this.props.addPlayerPermissionByName(this.state.userNameToPermit)}
                    >Berechtigen</Button>
                </div>
            </div>
            {this.createAuthorizationTable()}
        </div>
    }

    createAuthorizationTable() {
        return <Well style={{marginLeft: 20, marginRight: 20, paddingBottom: 0, textAlign: 'center'}}>
            <Table responsive hover style={{textAlign: 'center'}}>
                <thead>
                <tr>
                    <th style={{whiteSpace: 'normal', textAlign: 'center', maxWidth: 100}}>Name</th>
                    <th style={{whiteSpace: 'normal', textAlign: 'center'}}>Darf von mir in Spielen ausgewählt werden
                    </th>
                    <th style={{whiteSpace: 'normal', textAlign: 'center'}}>Darf mich in Spielen auswählen</th>
                </tr>
                </thead>
                <tbody>
                {this.state.playersInformation.map(playerInformation =>
                    playerInformation.id !== this.props.userId &&
                    <tr key={"user_row_" + playerInformation.id}>
                        <td style={{
                            whiteSpace: 'normal',
                            textOverflow: 'ellipsis',
                            maxWidth: 100
                        }}>{playerInformation.name}</td>
                        <td>
                            {playerInformation.playable
                                ? <Glyphicon style={{color: 'green'}} glyph="ok"/>
                                : <Glyphicon style={{color: 'red'}} glyph="remove"/>}
                        </td>
                        <td>
                            {playerInformation.permitted
                                ? <OverlayTrigger placement='top'
                                                  overlay={<Tooltip id="tooltip">Berechtigung nehmen</Tooltip>}>
                                    <Button bsStyle="success"
                                            onClick={() => this.props.removePlayerPermission(playerInformation.id)}
                                            disabled={this.props.isUpdatingPlayerPermission}>
                                        <Glyphicon glyph="ok"/>
                                    </Button>
                                </OverlayTrigger>
                                : <OverlayTrigger placement='top'
                                                  overlay={<Tooltip id="tooltip">Berechtigung geben</Tooltip>}>
                                    <Button bsStyle="danger"
                                            onClick={() => this.props.addPlayerPermissionById(playerInformation.id)}
                                            disabled={this.props.isUpdatingPlayerPermission}>
                                        <Glyphicon glyph="remove"/>
                                    </Button>
                                </OverlayTrigger>
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            {(this.props.isFetchingPlayableUsers || this.props.isFetchingPermittedUsers)
            &&
            <StackLoader label="Lade Spieler-Berechtigungen..."/>
            }
        </Well>
    }

}

Settings.propTypes = {
    userId: PropTypes.string,
    userName: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,

    playableUsers: PropTypes.array.isRequired,
    fetchPlayableUsersFailed: PropTypes.bool.isRequired,
    isFetchingPlayableUsers: PropTypes.bool.isRequired,

    permittedUsers: PropTypes.array.isRequired,
    fetchPermittedUsersFailed: PropTypes.bool.isRequired,
    isFetchingPermittedUsers: PropTypes.bool.isRequired,

    isUpdatingPlayerPermission: PropTypes.bool.isRequired,

    showLogin: PropTypes.func.isRequired,
    addPlayerPermissionById: PropTypes.func.isRequired,
    addPlayerPermissionByName: PropTypes.func.isRequired,
    removePlayerPermission: PropTypes.func.isRequired,
};

export default Settings;

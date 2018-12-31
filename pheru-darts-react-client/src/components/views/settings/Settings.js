import React from 'react'
import {Button, FormControl, Glyphicon, OverlayTrigger, Table, Tooltip, Well} from "react-bootstrap";
import {ifEnterKey} from "../../../util/functionUtil";
import PropTypes from "prop-types";
import StackLoader from "../../general/loaders/StackLoader";
import SpeechSettings from "./SpeechSettings";

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNameToPermit: "",
            permitButtonDisabled: true,
            playersInformation: Settings.mergeUsers(this.props.playableUsers, this.props.permittedUsers)
        };
        this.handleUserNameToPermitChange = this.handleUserNameToPermitChange.bind(this);
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

    handleUserNameToPermitChange(value) {
        let buttonDisabled = value === undefined || value === null || value === "";
        this.setState({
            userNameToPermit: value,
            permitButtonDisabled: buttonDisabled
        });
    }

    render() {
        return <div style={{textAlign: 'center'}}>
            <h3 style={{marginTop: 0}}><strong>Spracheinstellungen</strong></h3>
            <p style={{marginBottom: 0}}><strong>Sprachausgabe:</strong></p>
            <SpeechSettings style={{marginBottom: 5}}
                            selectedVoice={this.props.selectedVoice}
                            possibleVoices={this.props.possibleVoices}
                            onSelectedVoiceChange={this.props.setSelectedVoiceByName}/>
            {this.props.isLoggedIn
            && this.createUserSettings()
            }
        </div>
    }

    createUserSettings() {
        return <div>
            <h3 style={{marginTop: 25}}><strong>Spieler-Berechtigungen</strong></h3>
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
        return <Well style={{marginLeft: 20, marginRight: 20, marginTop: 25, paddingBottom: 0, textAlign: 'center'}}>
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

    possibleVoices: PropTypes.array.isRequired,
    selectedVoice: PropTypes.object,
    setSelectedVoiceByName: PropTypes.func.isRequired
};

export default Settings;
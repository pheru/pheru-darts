import React from 'react'
import {Button, FormControl, Glyphicon, OverlayTrigger, Table, Tooltip, Well} from "react-bootstrap";
import {ifEnterKey} from "../../../util/functionUtil";
import PropTypes from "prop-types";
import StackLoader from "../../general/loaders/StackLoader";
import SpeechSettings from "./SpeechSettings";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import {Redirect, Route} from "react-router-dom";
import NavigationBar, {DropdownConfig, NavigationBarContainer} from "../../general/navigationbar/NavigationBar";
import NavigationBarItem from "../../general/navigationbar/NavigationBarItem";
import OnlyForLoggedInUsersContainer from "../../../containers/OnlyForLoggedInUsersContainer";
import UserSettingsContainer from "../../../containers/UserSettingsContainer";

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
        let navigationBarItems = [
            this.props.isLoggedIn &&
            <NavigationBarItem key="settings_user_link" navigationItem={NAVIGATION_ITEM.SETTINGS_USER}/>,

            this.props.isLoggedIn &&
            <NavigationBarItem key="settings_permissions_link" navigationItem={NAVIGATION_ITEM.SETTINGS_PERMISSIONS}/>,

            <NavigationBarItem key="settings_speech_link" navigationItem={NAVIGATION_ITEM.SETTINGS_SPEECH}/>,
        ];
        let navigationBarDropdown = new DropdownConfig("settings_dropdown",
            <Glyphicon glyph="cog"/>, "Weitere Einstellungen");
        let navContainer = new NavigationBarContainer(navigationBarItems, navigationBarItems, navigationBarDropdown);
        return <div style={{textAlign: 'center'}}>
            <NavigationBar style={{top: 40, borderTop: "1px solid black", minHeight: 31}}
                           rightContainer={navContainer} alignCenter small/>
            <div style={{
                marginTop: 31,
                paddingTop: 10,
                paddingLeft: 20,
                paddingRight: 20,
                overflowY: "auto",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }}>
                <Route exact path={NAVIGATION_ITEM.SETTINGS.route} render={() => this.props.isLoggedIn
                    ? <Redirect to={NAVIGATION_ITEM.SETTINGS_USER.route}/>
                    : <Redirect to={NAVIGATION_ITEM.SETTINGS_SPEECH.route}/>}/>
                <Route path={NAVIGATION_ITEM.SETTINGS_SPEECH.route} render={() =>
                    <SpeechSettings style={{marginBottom: 5}}
                                    selectedVoice={this.props.selectedVoice}
                                    defaultVoice={this.props.defaultVoice}
                                    possibleVoices={this.props.possibleVoices}
                                    onSelectedVoiceChange={this.props.setSelectedVoiceByName}/>
                }
                />
                <Route path={NAVIGATION_ITEM.SETTINGS_USER.route} render={() =>
                    <OnlyForLoggedInUsersContainer
                        text="Benutzereinstellungen können nur von angemeldeten Benutzern angepasst werden">
                        <UserSettingsContainer/>
                    </OnlyForLoggedInUsersContainer>
                }
                />
                <Route path={NAVIGATION_ITEM.SETTINGS_PERMISSIONS.route} render={() =>
                    <OnlyForLoggedInUsersContainer
                        text="Berechtigungen können nur von angemeldeten Benutzern angepasst werden">
                        {this.createPermissionSettings()}
                    </OnlyForLoggedInUsersContainer>
                }
                />
            </div>
        </div>
    }

    createPermissionSettings() {
        return <div>
            <h3 style={{marginTop: 0}}><strong>Spieler-Berechtigungen</strong></h3>
            <div>
                <p><strong>Hier siehst Du welche Spieler Dir erlaubt haben ein Spiel mit ihnen zu erstellen und
                    kannst einstellen wer dich in einem Spiel auswählen darf.</strong></p>
                <FormControl style={{marginBottom: 5, width: 300, maxWidth: "95%", display: 'inline'}} type="text"
                             disabled={this.props.isUpdatingPlayerPermission}
                             value={this.state.userNameToPermit}
                             onChange={(e) => this.handleUserNameToPermitChange(e.target.value)}
                             onKeyDown={ifEnterKey(() => {
                                     if (!this.state.permitButtonDisabled && !this.props.isUpdatingPlayerPermission) {
                                         this.props.addPlayerPermissionByName(this.state.userNameToPermit)
                                     }
                                 }
                             )}
                             placeholder="Spieler berechtigen"/>
                <Button bsStyle="success" style={{marginLeft: 2}}
                        disabled={this.state.permitButtonDisabled || this.props.isUpdatingPlayerPermission}
                        onClick={() => this.props.addPlayerPermissionByName(this.state.userNameToPermit)}>
                    Berechtigen
                </Button>
            </div>
            {this.createAuthorizationTable()}
        </div>
    }

    createAuthorizationTable() {
        return <Well style={{marginTop: 20, paddingBottom: 0, textAlign: 'center'}}>
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
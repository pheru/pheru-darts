import React from 'react'
import {Alert, Button, FormControl, Glyphicon, Table, Well} from "react-bootstrap";

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.userName !== undefined ? props.userName : "",
            currentPassword: "",
            newPassword: "",
            passwordRepeat: "",
            passwordsMatch: true,
            playersInformation: Settings.mapUsers(this.props)
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userName !== prevProps.userName) {
            this.setState({name: this.props.userName});
        }
    }

    //TODO besser in componentDidUpdate
    static getDerivedStateFromProps(props, state) {
        return {playersInformation: Settings.mapUsers(props)};
    }

    static mapUsers(props) {
        return props.users.map(user => (
            {
                id: user.id,
                name: user.name,
                playable: Settings.isUserInList(user, props.playableUsers),
                authorized: Settings.isUserInList(user, props.authorizedUsers)
            }
        ));
    }

    static isUserInList(user, userList) {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id === user.id) {
                return true;
            }
        }
        return false;
    }

    handleNameChange(value) {
        this.setState({name: value});
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
                : <Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5}}>
                    <Glyphicon glyph="exclamation-sign"/> <strong>Einstellungen können nur von angemeldeten Benutzern
                    vorgenommen werden </strong>
                    <Button bsStyle="primary" onClick={this.props.showLogin}><Glyphicon
                        glyph="log-in"/> Anmelden</Button>
                </Alert>
            }
        </div>
    }

    createUserSettings() {
        return <div>
            {/*<div style={{marginBottom: 50}}>*/}
            <div>
                <h3 style={{marginLeft: 10, marginRight: 10}}><strong>Benutzer-Einstellungen</strong></h3>
                <Alert bsStyle="warning" style={{marginLeft: 15, marginRight: 15, marginBottom: 5}}>
                    <Glyphicon glyph="exclamation-sign"/> <strong>Ändern von Benutzer-Einstellungen noch nicht möglich</strong>
                </Alert>
                <div style={{marginLeft: 20, marginRight: 20}}>
                    <strong>Benutzername ändern: </strong>
                    <FormControl style={{marginBottom: 5, width: 300}} type="text"
                                 value={this.state.name}
                                 onChange={(e) => this.handleNameChange(e.target.value)}
                                 placeholder="Benutzername" autoFocus/>
                    <strong>Passwort ändern: </strong>
                    <FormControl style={{marginBottom: 5, width: 300}} type="password"
                                 value={this.state.currentPassword}
                                 onChange={(e) => this.handleCurrentPasswordChange(e.target.value)}
                                 placeholder="Aktuelles Passwort"/>
                    <FormControl style={{marginBottom: 5, width: 300}} type="password"
                                 value={this.state.newPassword}
                                 onChange={(e) => this.handleNewPasswordChange(e.target.value)}
                                 placeholder="Neues Passwort"/>
                    <FormControl style={{marginBottom: 5, width: 300}} type="password"
                                 value={this.state.passwordRepeat}
                                 onChange={(e) => this.handlePasswordRepeatChange(e.target.value)}
                                 placeholder="Neues Passwort wiederholen"/>
                    <Button bsStyle="primary" disabled={true}>Änderungen speichern</Button>
                    <p/>
                    <strong>Benutzer löschen: </strong>
                    <p/>
                    <div style={{color: "#d9534f"}}>
                        <Glyphicon glyph="alert"/> Dieser Vorgang kann nicht rückgängig gemacht werden <Glyphicon glyph="alert"/>
                    </div>
                    <FormControl style={{marginBottom: 5, width: 300}} type="password"
                        // value={this.state.password}
                        // onChange={(e) => this.handlePasswordChange(e.target.value)}
                                 placeholder="Passwort bestätigen"/>
                    <Button bsStyle="danger" disabled={true}>Benutzer löschen</Button>
                </div>
                <h3 style={{marginLeft: 10, marginRight: 10}}><strong>Spieler-Berechtigungen</strong></h3>
                <div style={{marginLeft: 20, marginRight: 20}}>
                    <p><strong>Hier kannst du sehen, welche Spieler dir erlaubt haben ein Spiel mit ihnen zu
                        erstellen.</strong></p>
                    <p><strong>Außerdem kannst du hier andere Spieler berechtigen, ein Spiel mit dir zu
                        erstellen.</strong></p>
                </div>
                {this.createAuthorizationTable()}
            </div>
            {/*<div style={{position:'fixed', bottom: 0, width:'100%', background:'#222', textAlign:'right'}}>*/}
            {/*<Button bsStyle="primary" disabled={true} style={{margin:5}}>Änderungen Speichern</Button>*/}
            {/*</div>*/}
        </div>
    }

    createAuthorizationTable() {
        return <Well style={{marginLeft: 20, marginRight: 20, paddingBottom: 0}}>
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
                            {playerInformation.authorized
                                ? <Button bsStyle="success"
                                          onClick={() => this.props.removePlayerPermission(playerInformation.id)}
                                          disabled={this.props.isUpdatingPlayerPermission}>
                                    <Glyphicon glyph="ok"/>
                                </Button>
                                : <Button bsStyle="danger"
                                          onClick={() => this.props.addPlayerPermission(playerInformation.id)}
                                          disabled={this.props.isUpdatingPlayerPermission}>
                                    <Glyphicon glyph="remove"/>
                                </Button>}
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Well>;
    }

}

Settings.propTypes = {};

export default Settings;

import React from 'react'
import {Button, FormControl, Glyphicon, OverlayTrigger, Table, Tooltip, Well} from "react-bootstrap";
import PropTypes from 'prop-types';
import DocumentUtil from "../../../util/DocumentUtil";
import KeyUtil from "../../../util/KeyUtil";
import StackLoader from "../../general/loaders/StackLoader";

const TITLE = "Berechtigungen";

class PermissionSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNameToPermit: "",
            playersInformation: this.mergeUsers(this.props.playableUsers, this.props.permittedUsers)
        };
        this.handleUserNameToPermitChange = this.handleUserNameToPermitChange.bind(this);
    }

    componentDidMount() {
        DocumentUtil.setTitlePrefix(TITLE);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userId !== prevProps.userId
            || this.props.permittedUsers !== prevProps.permittedUsers
            || this.props.playableUsers !== prevProps.playableUsers) {
            this.setState({
                playersInformation: this.mergeUsers(this.props.playableUsers, this.props.permittedUsers)
            });
        }
    }

    mergeUsers(playableUsers, permittedUsers) {
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
                    break;
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
        this.setState({
            userNameToPermit: value
        });
    }

    isBusy() {
        return this.props.isUpdatingPlayerPermission
            || this.props.isFetchingPlayableUsers
            || this.props.isFetchingPermittedUsers
    }

    isUserNameToPermitEmpty() {
        return this.state.userNameToPermit === undefined
        || this.state.userNameToPermit === null
        || this.state.userNameToPermit === "";
    }

    isPermitButtonDisabled() {
        return this.isBusy() || this.isUserNameToPermitEmpty();
    }

    render() {
        return <div>
            <h3 style={{marginTop: 0}}><strong>{TITLE}</strong></h3>
            <div>
                <p><strong>Hier siehst Du welche Spieler Dir erlaubt haben ein Spiel mit ihnen zu erstellen und
                    kannst einstellen wer dich in einem Spiel auswählen darf.</strong></p>
                <FormControl style={{marginBottom: 5, marginRight: 2,width: 300, maxWidth: "95%", display: 'inline'}} type="text"
                             disabled={this.isBusy()}
                             value={this.state.userNameToPermit}
                             onChange={(e) => this.handleUserNameToPermitChange(e.target.value)}
                             onKeyDown={KeyUtil.ifEnterKey(() => {
                                     if (!this.isPermitButtonDisabled()) {
                                         this.props.addPlayerPermissionByName(this.state.userNameToPermit)
                                     }
                                 }
                             )}
                             placeholder="Spieler berechtigen"/>
                    {/*margin nur 2, weil ansonsten Input und Button nicht auf einer Linie liegen*/}
                <Button bsStyle="success" style={{marginBottom: 2}}
                        disabled={this.isPermitButtonDisabled()}
                        onClick={() => this.props.addPlayerPermissionByName(this.state.userNameToPermit)}>
                    Berechtigen
                </Button>
            </div>
            <Well style={{marginTop: 3,paddingBottom: 0, textAlign: 'center'}}>
                <Table responsive hover style={{textAlign: 'center'}}>
                    <thead>
                    <tr>
                        <th style={{whiteSpace: 'normal', textAlign: 'center', maxWidth: 100}}>Name</th>
                        <th style={{whiteSpace: 'normal', textAlign: 'center'}}>Darf von mir in Spielen ausgewählt
                            werden
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
        </div>
    }
}

PermissionSettings.propTypes = {
    userId: PropTypes.string,

    playableUsers: PropTypes.array.isRequired,
    fetchPlayableUsersFailed: PropTypes.bool.isRequired,
    isFetchingPlayableUsers: PropTypes.bool.isRequired,

    permittedUsers: PropTypes.array.isRequired,
    fetchPermittedUsersFailed: PropTypes.bool.isRequired,
    isFetchingPermittedUsers: PropTypes.bool.isRequired,

    isUpdatingPlayerPermission: PropTypes.bool.isRequired,

    addPlayerPermissionById: PropTypes.func.isRequired,
    addPlayerPermissionByName: PropTypes.func.isRequired,
    removePlayerPermission: PropTypes.func.isRequired
};

export default PermissionSettings
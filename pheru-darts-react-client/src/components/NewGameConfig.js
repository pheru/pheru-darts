import React from 'react'
import {
    Button,
    Col,
    Glyphicon,
    Grid,
    OverlayTrigger,
    Row,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from "react-bootstrap";
import {ALL_CHECKOUT_MODES, DOUBLE_OUT} from "../constants/checkoutModes";
import {GAME_ROUTE} from "../constants/routes";
import DropdownTextfield from "./DropdownTextfield";
import PropTypes from "prop-types";
import {ALL_CHECKIN_MODES, SINGLE_IN} from "../constants/checkinModes";

const SCORE_CHOICES = ["101", "201", "301", "401", "501", "1001"];

class NewGameConfig extends React.Component {

    constructor(props) {
        super(props);
        if (props.initialState !== undefined) {
            this.state = {...props.initialState};
        } else {
            this.state = {
                score: SCORE_CHOICES[4],
                selectedPlayers: [
                    {name: ""},
                    {name: ""}
                ],
                checkOutMode: DOUBLE_OUT,
                checkInMode: SINGLE_IN
            };
        }
        this.colStyle = {
            marginBottom: 15
        };
        this.colStyleButton = {
            ...this.colStyle
        };

        this.swapPlayerSelection = this.swapPlayerSelection.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
        this.handleUnregisteredUserChange = this.handleUnregisteredUserChange.bind(this);
        this.handleCheckInModeChange = this.handleCheckInModeChange.bind(this);
        this.handleCheckOutModeChange = this.handleCheckOutModeChange.bind(this);
        this.onStartNewGameButtonClicked = this.onStartNewGameButtonClicked.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.playerIconFactory = this.playerIconFactory.bind(this);
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.isFetchingUsers && !this.props.isFetchingUsers)
            || (prevProps.isLoggedIn && !this.props.isLoggedIn)) {
            // Damit die ID richtig ergänzt wird, wenn User geladen wurden bzw.
            // entfernt werden, wenn nicht mehr eingeloggt
            let selected = this.state.selectedPlayers.slice();
            for (let i = 0; i < selected.length; i++) {
                let playableUser = this.getPlayableUserByName(selected[i].name);
                if (playableUser) {
                    selected[i] = playableUser;
                } else {
                    selected[i] = {name: selected[i].name};
                }
                this.setState({
                    selectedPlayers: selected
                });
            }
        }
    }

    componentWillUnmount() {
        this.props.memorizeState(this.state);
    }

    changeSelectedPlayer(selectedPlayerIndex, player) {
        for (let i = 0; i < this.state.selectedPlayers.length; i++) {
            if (i !== selectedPlayerIndex && this.state.selectedPlayers[i] === player) {
                this.swapPlayerSelection();
                return;
            }
        }
        let selected = this.state.selectedPlayers.slice();
        selected[selectedPlayerIndex] = player;
        this.setState({
            selectedPlayers: selected
        });
    }

    swapPlayerSelection() {
        let swapped = this.state.selectedPlayers.slice().reverse();
        this.setState({
            selectedPlayers: swapped
        });
    }

    handleUnregisteredUserChange(selectedPlayerIndex, value) {
        let selected = this.state.selectedPlayers.slice();
        let playableUser = this.getPlayableUserByName(value);
        if (playableUser) {
            selected[selectedPlayerIndex] = playableUser;
        } else {
            selected[selectedPlayerIndex] = {name: value};
        }
        this.setState({
            selectedPlayers: selected
        });
    }

    handleScoreChange(value) {
        if (value !== "" && !this.isValidScore(value)) {
            return;
        }
        this.setState({
            score: value
        });
    }

    isValidScore(value) {
        return /^[1-9]+\d*$/.test(value);
    }

    handleCheckInModeChange(e) {
        this.setState({
            checkInMode: e
        });
    }

    handleCheckOutModeChange(e) {
        this.setState({
            checkOutMode: e
        });
    }

    onStartNewGameButtonClicked(e) {
        if (!this.validateGameConfig()) {
            e.preventDefault();
            return;
        }
        if (this.props.gameRunning) {
            this.props.showConfirmation(
                "Neues Spiel starten?",
                "Das aktuelle Spiel wird dadurch abgebrochen.",
                () => this.startNewGame());
        } else {
            this.startNewGame();
        }
    }

    validateGameConfig() {
        let validationMessages = [];
        let players = this.state.selectedPlayers;
        if (!this.props.training) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id === undefined && players[i].name === "") {
                    validationMessages.push("Es wurden nicht alle benötigten Spieler ausgewählt");
                    break;
                }
                for (let j = i + 1; j < players.length; j++) {
                    if (players[i].name === players[j].name) {
                        validationMessages.push("Spieler dürfen nicht mehrfach vorkommen");
                        break;
                    }
                }
            }
        }
        if (!this.isValidScore(this.state.score)) {
            validationMessages.push("Es wurde kein gültiger Score angegeben");
        }
        if (validationMessages.length > 0) {
            this.props.showWarning("Ungültige Spielkonfiguration",
                <ul>{this.validationMessagesToListEntries(validationMessages)}</ul>
            );
            return false;
        }
        return true
    }

    validationMessagesToListEntries(validationMessages) {
        let listEntries = [];
        for (let i = 0; i < validationMessages.length; i++) {
            listEntries.push(<li key={"validationMessage_" + i}>{validationMessages[i]}</li>)
        }
        return listEntries;
    }

    startNewGame() {
        let players;
        if (this.props.training) {
            players = [{id: this.props.userId, name: "Training"}];
        } else {
            players = this.state.selectedPlayers;
        }
        this.props.startNewGame(players, Number(this.state.score), this.state.checkInMode, this.state.checkOutMode, this.props.training);
        this.props.history.push(GAME_ROUTE);
    }

    playerIconFactory(playerName) {
        if (!this.props.isLoggedIn || !playerName || this.props.isFetchingUsers) {
            return null;
        }
        if (this.getPlayableUserByName(playerName)) {
            return <Glyphicon glyph='ok' style={{color: 'green'}}/>;
        }
        return <OverlayTrigger placement='bottom'
                               overlay={<Tooltip id="user-tooltip">
                                   Dieser Spieler ist entweder kein registrierter Benutzer oder Du bist nicht berechtigt
                                   worden, ein Spiel mit ihm zu erstellen.<br/>
                                   In den Statistiken wird dieser Spieler als "Unregistrierter Benutzer" gelistet.
                               </Tooltip>}>
            <Glyphicon glyph='exclamation-sign' style={{color: 'orange'}}/>
        </OverlayTrigger>;
    }

    getPlayableUserByName(name) {
        for (let i = 0; i < this.props.playableUsers.length; i++) {
            if (this.props.playableUsers[i].name === name) {
                return this.props.playableUsers[i];
            }
        }
        return null;
    }

    render() {
        return <div>
            <Grid>
                {!this.props.training &&
                <Row className="show-grid text-center">
                    <Col xs={12} sm={5} style={this.colStyle}>
                        <DropdownTextfield id="player-1-dropdown" placeholder="Spieler 1"
                                           value={this.state.selectedPlayers[0].name}
                                           choices={this.props.playableUsers}
                                           dropdownPropertyName='name'
                                           style={{width: '100%'}}
                                           iconFactory={this.playerIconFactory}
                                           onDropdownClick={(newValue) => this.changeSelectedPlayer(0, newValue)}
                                           onInputChange={(newValue) => this.handleUnregisteredUserChange(0, newValue)}/>
                    </Col>
                    <Col xs={6} xsOffset={3} sm={2} smOffset={0} style={this.colStyleButton}>
                        <Button block bsStyle="primary" onClick={this.swapPlayerSelection}>
                            <Glyphicon glyph="transfer"/>
                        </Button>
                    </Col>
                    <Col xs={12} sm={5} style={this.colStyle}>
                        <DropdownTextfield id="player-1-dropdown" placeholder="Spieler 2"
                                           value={this.state.selectedPlayers[1].name}
                                           choices={this.props.playableUsers}
                                           dropdownPropertyName='name'
                                           style={{width: '100%'}}
                                           iconFactory={this.playerIconFactory}
                                           onDropdownClick={(newValue) => this.changeSelectedPlayer(1, newValue)}
                                           onInputChange={(newValue) => this.handleUnregisteredUserChange(1, newValue)}/>
                    </Col>
                </Row>
                }
                <Row className="show-grid text-center">
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <DropdownTextfield id="score-dropdown" value={this.state.score} choices={SCORE_CHOICES}
                                           onDropdownClick={(newValue) => this.handleScoreChange(newValue)}
                                           onInputChange={(newValue) => this.handleScoreChange(newValue)}/>
                    </Col>
                </Row>
                <Row className="show-grid text-center">
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.checkInMode}
                                           onChange={this.handleCheckInModeChange}>
                            {ALL_CHECKIN_MODES.map(mode =>
                                <ToggleButton
                                    style={{width: '50%'}} key={mode.key} value={mode}>{mode.text}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row className="show-grid text-center">
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.checkOutMode}
                                           onChange={this.handleCheckOutModeChange}>
                            {ALL_CHECKOUT_MODES.map(mode =>
                                <ToggleButton key={mode.key} value={mode}>{mode.text}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row className="show-grid text-center">
                    <Col xs={12} sm={12} style={this.colStyleButton}>
                        <Button bsStyle="primary" bsSize="large" block
                                disabled={this.props.isLoggingIn}
                                onClick={this.onStartNewGameButtonClicked}>
                            Neues {this.props.training ? "Trainingsspiel" : "Spiel"} starten
                        </Button>
                    </Col>
                </Row>
            </Grid>
        </div>
    }
}

NewGameConfig.propTypes = {
    initialState: PropTypes.object,
    training: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    playableUsers: PropTypes.array.isRequired,
    gameRunning: PropTypes.bool.isRequired,
    fetchAllUsersFailed: PropTypes.bool.isRequired,
    isFetchingUsers: PropTypes.bool.isRequired,
    startNewGame: PropTypes.func.isRequired,
    memorizeState: PropTypes.func.isRequired,
    showWarning: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired
};

export default NewGameConfig

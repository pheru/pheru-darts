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
import {ALL_MODES, DOUBLE_OUT} from "../constants/checkoutModes";
import {LinkContainer} from "react-router-bootstrap";
import ConfirmModal from "./modals/ConfirmModal";
import {GAME_ROUTE} from "../constants/routes";
import DropdownTextfield from "./DropdownTextfield";
import PropTypes from "prop-types";

class NewGameConfig extends React.Component {

    constructor(props) {
        super(props);
        if (props.initialState !== undefined) {
            this.state = {...props.initialState, showNewGameModal: false};
        } else {
            this.state = {
                score: 501,
                selectedPlayers: [
                    {name: ""},
                    {name: ""}
                ],
                checkOutMode: DOUBLE_OUT,
                showNewGameModal: false
            };
        }
        this.colStyle = {
            marginBottom: 15
        };
        this.colStyleButton = {
            ...this.colStyle,
            padding: 0
        };
        this.scoreChoices = [101, 201, 301, 401, 501, 1001];

        this.swapPlayerSelection = this.swapPlayerSelection.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
        this.handleUnregisteredUserChange = this.handleUnregisteredUserChange.bind(this);
        this.handleCheckOutModeChange = this.handleCheckOutModeChange.bind(this);
        this.onStartNewGameButtonClicked = this.onStartNewGameButtonClicked.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.hideNewGameModal = this.hideNewGameModal.bind(this);
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
        if (Number.isNaN(value)) {
            return;
        }
        this.setState({
            score: value
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
            this.setState({showNewGameModal: true});
            // Um routing zu verhindern
            e.preventDefault();
        } else {
            this.startNewGame();
        }
    }

    validateGameConfig() {
        let players = this.state.selectedPlayers;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === undefined && players[i].name === "") {
                this.props.showWarning("Ungültige Spielkonfiguration", "Es wurden nicht alle benötigten Spieler ausgewählt");
                return false;
            }
            for (let j = i + 1; j < players.length; j++) {
                if (players[i].name === players[j].name) {
                    this.props.showWarning("Ungültige Spielkonfiguration", "Spieler dürfen nicht mehrfach vorkommen");
                    return false;
                }
            }
        }
        return true
    }

    hideNewGameModal() {
        this.setState({showNewGameModal: false})
    }

    startNewGame() {
        this.props.startNewGame(this.state.selectedPlayers, this.state.score, this.state.checkOutMode);
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
                               overlay={<Tooltip id="tooltip">
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
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <DropdownTextfield id="score-dropdown" value={this.state.score} choices={this.scoreChoices}
                                           onDropdownClick={(newValue) => this.handleScoreChange(newValue)}
                                           onInputChange={(newValue) => this.handleScoreChange(parseInt(newValue, 10))}/>
                    </Col>
                </Row>
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.checkOutMode}
                                           onChange={this.handleCheckOutModeChange}>
                            {ALL_MODES.map(mode =>
                                <ToggleButton key={mode.key} value={mode}>{mode.text}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={12} style={this.colStyleButton}>
                        <LinkContainer to={GAME_ROUTE}>
                            <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.onStartNewGameButtonClicked}
                            >Neues Spiel starten</Button>
                        </LinkContainer>
                    </Col>
                </Row>
            </Grid>
            <ConfirmModal text="Es läuft bereits ein Spiel. Dennoch ein neues Spiel starten?"
                          show={this.state.showNewGameModal}
                          onConfirm={() => {
                              this.hideNewGameModal();
                              this.startNewGame();
                          }}
                          onCancel={this.hideNewGameModal}/>
        </div>
    }
}

NewGameConfig.propTypes = {
    initialState: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired,
    playableUsers: PropTypes.array.isRequired,
    gameRunning: PropTypes.bool.isRequired,
    fetchAllUsersFailed: PropTypes.bool.isRequired,
    isFetchingUsers: PropTypes.bool.isRequired,
    startNewGame: PropTypes.func.isRequired,
    memorizeState: PropTypes.func.isRequired,
    showWarning: PropTypes.func.isRequired
};

export default NewGameConfig

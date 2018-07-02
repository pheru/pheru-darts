import React from 'react'
import {
    Button,
    Col,
    Dropdown,
    FormControl,
    Glyphicon,
    Grid,
    MenuItem,
    Row,
    ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
import {ALL_MODES, DOUBLE_OUT} from "../constants/checkoutModes";
import {LinkContainer} from "react-router-bootstrap";
import ConfirmModal from "./modals/ConfirmModal";
import {GAME_ROUTE} from "../constants/routes";
import {ScaleLoader} from "react-spinners";

class NewGameConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 501,
            selectedPlayers: [
                {name: ""},
                {name: ""}
            ],
            checkOutMode: DOUBLE_OUT,
            showNewGameModal: false
        };
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
        if (value) {
            selected[selectedPlayerIndex] = {id: -1, name: value};
        } else {
            selected[selectedPlayerIndex] = {name: ""};
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
        let allPlayersChosen = true;
        for (let i = 0; i < this.state.selectedPlayers.length; i++) {
            if (this.state.selectedPlayers[i].id === undefined) {
                allPlayersChosen = false;
                break;
            }
        }
        if (!allPlayersChosen) {
            alert("Zuerst Spieler auswählen!");
            e.preventDefault();
        } else if (this.props.gameRunning) {
            this.setState({showNewGameModal: true});
            // Um routing zu verhindern
            e.preventDefault();
        } else {
            this.startNewGame();
        }
    }

    hideNewGameModal() {
        this.setState({showNewGameModal: false})
    }

    startNewGame() {
        this.props.startNewGame(this.state.selectedPlayers, this.state.score, this.state.checkOutMode);
        this.props.history.push(GAME_ROUTE);
    }

    render() {
        return <div>
            <Grid>
                <Row className="show-grid text-center">
                    <Col xs={12} sm={2} style={this.colStyle}>
                        <h3 style={{margin: 0}}>Spieler: </h3>
                    </Col>
                    <Col xs={12} sm={4} style={this.colStyle}>
                        {this.props.isFetchingUsers ? <ScaleLoader height={25}/> : this.createPlayerDropDown(1)}
                    </Col>
                    <Col xs={6} xsOffset={3} sm={2} smOffset={0} style={this.colStyleButton}>
                        <Button block bsStyle="primary" onClick={this.swapPlayerSelection}
                                disabled={this.props.isFetchingUsers}>
                            <Glyphicon glyph="transfer"/>
                        </Button>
                    </Col>
                    <Col xs={12} sm={4} style={this.colStyle}>
                        {this.props.isFetchingUsers ? <ScaleLoader height={25}/> : this.createPlayerDropDown(2)}
                    </Col>
                </Row>
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={2} style={this.colStyle}>
                        <h3 style={{margin: 0}}>Punkte: </h3>
                    </Col>
                    <Col xs={12} sm={10} style={this.colStyle}>
                        <Dropdown style={{display: 'inline-flex'}} id={"score_dropdown"}>
                            <FormControl type="text" value={this.state.score}
                                         onChange={(e) => this.handleScoreChange(parseInt(e.target.value, 10))}
                                         style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}/>
                            <Dropdown.Toggle style={{borderLeftWidth: 0}}/>
                            <Dropdown.Menu style={{minWidth: '100%', textAlign: 'center'}}>
                                {this.scoreChoices.map(score =>
                                    <MenuItem key={"scoreChoice_" + score}
                                              onClick={() => this.handleScoreChange(score)}>
                                        {score}
                                    </MenuItem>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={2} style={this.colStyle}>
                        <h3 style={{margin: 0}}>Check-Out: </h3>
                    </Col>
                    <Col xs={12} sm={10} style={this.colStyle}>
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
                                    disabled={this.props.isFetchingUsers}
                            >Neues Spiel starten</Button>
                        </LinkContainer>
                    </Col>
                </Row>
            </Grid>
            <ConfirmModal text="Es läuft bereits ein Spiel. Dennoch ein neues Spiel starten?"
                          show={this.state.showNewGameModal} onConfirm={this.startNewGame}
                          onCancel={this.hideNewGameModal}/>
        </div>
    }

    createPlayerDropDown(playerNumber) {
        if (this.props.fetchAllUsersFailed || !this.props.isLoggedIn) {
            return <FormControl type="text" placeholder={"Spieler " + playerNumber}
                                value={this.state.selectedPlayers[playerNumber - 1].name}
                                onChange={(e) => this.handleUnregisteredUserChange(playerNumber - 1, e.target.value)}/>
        }
        return <Dropdown id={"playerDropdown_" + playerNumber} block vertical>
            <Dropdown.Toggle>
                {this.state.selectedPlayers[playerNumber - 1].name
                    ? this.state.selectedPlayers[playerNumber - 1].name
                    : "[Spieler " + playerNumber + "]"
                }
            </Dropdown.Toggle>
            <Dropdown.Menu style={{minWidth: '100%', textAlign: 'center'}}>
                {this.props.playableUsers.map(player =>
                    <MenuItem key={playerNumber + "_" + player.id}
                              onClick={() => this.changeSelectedPlayer(playerNumber - 1, player)}>{player.name}</MenuItem>
                )}
            </Dropdown.Menu>
        </Dropdown>
    }
}

NewGameConfig.propTypes = {};

export default NewGameConfig

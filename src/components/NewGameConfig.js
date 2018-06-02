import React from 'react'
import {Button, Col, FormControl, Glyphicon, Grid, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {ALL_MODES, DOUBLE_OUT} from "../constants/checkoutModes";
import {Dropdown, MenuItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import ConfirmModal from "./ConfirmModal";
import {GAME_ROUTE} from "../constants/routes";

class NewGameConfig extends React.Component {

    constructor(props) {
        super(props);
        this.players = [
            {id: 1, name: "Philipp"},
            {id: 2, name: "Patrick"}
        ];
        this.state = {
            score: 501,
            selectedPlayers: [
                this.players[0] ? this.players[0] : "",
                this.players[1] ? this.players[1] : ""
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

        this.swapPlayerSelection = this.swapPlayerSelection.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
        this.handleCheckOutModeChange = this.handleCheckOutModeChange.bind(this);
        this.onStartNewGameButtonClicked = this.onStartNewGameButtonClicked.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
    }

    changeSelectedPlayer(selectedPlayerIndex, player) {
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

    handleScoreChange(e) {
        let newValue = parseInt(e.target.value, 10);
        if (Number.isNaN(newValue)) {
            return;
        }
        this.setState({
            score: parseInt(e.target.value, 10)
        });
    }

    handleCheckOutModeChange(e) {
        this.setState({
            checkOutMode: e
        });
    }

    onStartNewGameButtonClicked(e) {
        if (this.props.gameRunning) {
            this.setState({
                showNewGameModal: true
            });
            // Um routing zu verhindern
            e.preventDefault();
        } else {
            this.startNewGame();
        }
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
                        {this.createPlayerDropDown(1)}
                    </Col>
                    <Col xs={6} xsOffset={3} sm={2} smOffset={0} style={this.colStyleButton}>
                        <Button block bsStyle="primary" onClick={this.swapPlayerSelection}>
                            <Glyphicon glyph="transfer"/>
                        </Button>
                    </Col>
                    <Col xs={12} sm={4} style={this.colStyle}>
                        {this.createPlayerDropDown(2)}
                    </Col>
                </Row>
                <Row className="show-grid  text-center">
                    <Col xs={12} sm={2} style={this.colStyle}>
                        <h3 style={{margin: 0}}>Punkte: </h3>
                    </Col>
                    <Col xs={12} sm={10} style={this.colStyle}>
                        <FormControl type="text" value={this.state.score} onChange={this.handleScoreChange}/>
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
                            >Neues Spiel starten</Button>
                        </LinkContainer>
                    </Col>
                </Row>
            </Grid>
            <ConfirmModal text="Es läuft bereits ein Spiel. Dennoch ein neues Spiel starten?"
                          show={this.state.showNewGameModal} onConfirm={this.startNewGame}/>
        </div>
    }

    createPlayerDropDown(playerNumber) {
        return <Dropdown id={"playerDropdown_" + playerNumber} block vertical>
            <Dropdown.Toggle>
                {this.state.selectedPlayers[playerNumber - 1].name}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{minWidth: '100%', textAlign: 'center'}}>
                {this.players.map(player =>
                    <MenuItem key={playerNumber + "_" + player.id}
                              onClick={() => this.changeSelectedPlayer(playerNumber - 1, player)}>{player.name}</MenuItem>
                )}
            </Dropdown.Menu>
        </Dropdown>
    }
}

NewGameConfig.propTypes = {};

export default NewGameConfig

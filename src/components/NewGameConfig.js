import React from 'react'
import {
    Button,
    Col,
    DropdownButton,
    FormControl,
    Grid,
    MenuItem,
    Row,
    ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
import {ALL_MODES, DOUBLE_OUT} from "../constants/checkoutModes";

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
            ], checkOutMode: DOUBLE_OUT
        };
        this.colStyle = {
            marginBottom: 15
        };

        this.swapPlayerSelection = this.swapPlayerSelection.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
        this.handleCheckOutModeChange = this.handleCheckOutModeChange.bind(this);
    }

    render() {
        return <Grid>
            <Row className="show-grid text-center">
                <Col xs={12} sm={2} style={this.colStyle}>
                    <h3 style={{margin: 0}}>Spieler: </h3>
                </Col>
                <Col xs={12} sm={2} style={this.colStyle}>
                    {this.createPlayerDropDown(1)}
                </Col>
                <Col xs={12} sm={2} style={this.colStyle}>
                    <Button bsStyle="info" onClick={this.swapPlayerSelection}>Tauschen</Button>
                </Col>
                <Col xs={12} sm={2} style={this.colStyle}>
                    {this.createPlayerDropDown(2)}
                </Col>
                <Col xs={8} sm={2} smOffset={1} style={{...this.colStyle, paddingRight: 1}}>
                    <FormControl type="text" placeholder="Neuer Spieler"/>
                </Col>
                <Col xs={4} sm={1} style={{...this.colStyle, paddingLeft: 1}}>
                    <Button bsStyle="success" block>+</Button>
                </Col>
            </Row>
            <Row className="show-grid text-center">
                <Col xs={12} sm={2} style={this.colStyle}>
                    <h3 style={{margin: 0}}>Punkte: </h3>
                </Col>
                <Col xs={12} sm={10} style={this.colStyle}>
                    <FormControl type="text" value={this.state.score} onChange={this.handleScoreChange}/>
                </Col>
            </Row>
            <Row className="show-grid text-center">
                <Col xs={12} sm={2} style={this.colStyle}>
                    <h3 style={{margin: 0}}>Check-Out: </h3>
                </Col>
                <Col xs={12} sm={10} style={this.colStyle}>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.checkOutMode} onChange={this.handleCheckOutModeChange}>
                        {ALL_MODES.map(mode =>
                            <ToggleButton key={mode} value={mode}>{mode}</ToggleButton>
                        )}
                    </ToggleButtonGroup>
                </Col>
            </Row>
            <Row className="show-grid text-center">
                <Col xs={12} sm={12} style={this.colStyle}>
                    <Button bsStyle="primary" bsSize="large" block
                            onClick={() => this.props.startNewGameButtonClicked(this.state.selectedPlayers, this.state.score, this.state.checkOutMode)}
                    >Neues Spiel starten</Button>
                </Col>
            </Row>
        </Grid>
    }

    createPlayerDropDown(playerNumber) {
        return <DropdownButton id={"playerDropdown_" + playerNumber}
                               title={this.state.selectedPlayers[playerNumber - 1].name}>
            {this.players.map(player =>
                <MenuItem key={playerNumber + "_" + player.id}
                          onClick={() => this.changeSelectedPlayer(playerNumber - 1, player)}>{player.name}</MenuItem>
            )}
        </DropdownButton>
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
}

NewGameConfig.propTypes = {};

export default NewGameConfig

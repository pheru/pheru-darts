import React from 'react'
import PlayerContainer from "../../../containers/views/game/PlayerContainer";
import {Button, Col, Dropdown, Glyphicon, Grid, MenuItem, Modal, Row, Well} from "react-bootstrap";
import PropTypes from "prop-types";
import SpeechUtil from "../../../util/SpeechUtil";
import DocumentUtil from "../../../util/DocumentUtil";
import ScoreButtons from "./ScoreButtons";
import WindowUtil from "../../../util/WindowUtil";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            landscapeOrientation: WindowUtil.isLandscapeOrientation(),
            gameFinishedModalShow: props.winner !== undefined,
            rematchStartingPlayer: props.players[props.players.length > 1 ? 1 : 0]
        };
        this.colStyle = {
            marginBottom: 15
        };
        this.colStyleButton = {
            ...this.colStyle,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 2,
            paddingRight: 2
        };
        this.modalBodyStyle = {
            textAlign: 'center'
        };
        this.updateOrientation = this.updateOrientation.bind(this);
        this.handleGameFinishedModalClose = this.handleGameFinishedModalClose.bind(this);
        this.handleRematchStartingPlayerChanged = this.handleRematchStartingPlayerChanged.bind(this);
    }

    componentDidMount() {
        DocumentUtil.setTitlePrefix("Aktuelles Spiel");
        window.addEventListener("resize", this.updateOrientation);
    }

    componentDidUpdate(prevProps) {
        if (this.props.players !== prevProps.players
            || this.props.winner !== prevProps.winner) {
            this.setState({
                rematchStartingPlayer: this.props.players[this.props.players.length > 1 ? 1 : 0],
                gameFinishedModalShow: this.props.winner !== undefined
            });
        }
        if (this.props.speechOutputActive && this.props.announcementText
            && this.props.announcementText !== prevProps.announcementText) {
            SpeechUtil.speak(this.props.announcementText, this.props.selectedVoice);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateOrientation);
    }

    updateOrientation(e) {
        let landscapeOrientation = WindowUtil.isLandscapeOrientation();
        if (this.state.landscapeOrientation !== landscapeOrientation) {
            this.setState({landscapeOrientation});
        }
    }

    handleRematchStartingPlayerChanged(player) {
        this.setState({rematchStartingPlayer: player});
    }

    handleGameFinishedModalClose() {
        this.setState({gameFinishedModalShow: false});
    }

    render() {
        let upperContainerStyle = this.state.landscapeOrientation ? {height: "40%", display: "flex"} : {height: "40%"};
        let playerWrapperStyle = this.state.landscapeOrientation ? {paddingRight: 8, paddingBottom: 8, height: "100%", width: "45%"} : {height: "40%", width: "100%"};
        let playerStyle = {height: "100%", width: "100%"};
        let buttonContainerStyle = this.state.landscapeOrientation ? {display: "flex", flexDirection: "column", height: "100%", width: "10%"} : {height: "20%", width: "100%"};
        let buttonStyle = this.state.landscapeOrientation ? {flexGrow: 1, marginBottom: 8, lineHeight: 0, fontSize: "6vh"} : {height: "100%", width: "50%"};
        return <div style={{height: "100%"}}>
            <div style={upperContainerStyle}>
                <div style={playerWrapperStyle}>
                    <PlayerContainer style={playerStyle} index={0}/>
                </div>
                {!this.props.training &&
                    <div style={playerWrapperStyle}>
                        <PlayerContainer style={playerStyle} index={1}/>
                    </div>
                }
                <div style={buttonContainerStyle}>
                    <Button bsStyle='warning' style={buttonStyle}
                            onClick={() => this.props.undoDart()}>
                        <Glyphicon glyph="erase"/>
                    </Button>
                    <Button bsStyle='info' style={buttonStyle}
                            onClick={() => this.props.toggleSpeechOutput()}>
                        <Glyphicon glyph={this.props.speechOutputActive ? "volume-up" : "volume-off"}/>
                    </Button>
                </div>
            </div>
            <ScoreButtons style={{height: "60%", width: "100%"}} addDart={this.props.addDart}/>

            <Modal dialogClassName='modal-bottom' show={this.state.gameFinishedModalShow}
                   onHide={this.handleGameFinishedModalClose}
                   keyboard={false} backdrop='static'>
                <Modal.Body style={this.modalBodyStyle}>
                    <h4>{this.props.winner !== undefined && this.props.winner.name} hat gewonnen!</h4>
                </Modal.Body>
                <Modal.Footer style={{textAlign: 'center'}}>
                    <Dropdown style={{display: 'inline-flex'}} id="rematch_player_dropdown">
                        <Button bsStyle='primary' onClick={() => {
                            if (this.props.isLoggedIn) {
                                this.props.archiveGame(this.props.game);
                            }
                            this.props.rematch(this.state.rematchStartingPlayer);
                        }}>
                            Rematch ({this.state.rematchStartingPlayer.name} beginnt)
                        </Button>
                        <Dropdown.Toggle bsStyle="primary"/>
                        <Dropdown.Menu style={{minWidth: '100%', textAlign: 'center'}}>
                            {this.props.players.map((player, i) =>
                                <MenuItem key={"rematch_player_" + i}
                                          onClick={() => this.handleRematchStartingPlayerChanged(player)}>
                                    {player.name} beginnt
                                </MenuItem>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button style={{marginLeft: 10}} bsStyle='primary' onClick={() => {
                        if (this.props.isLoggedIn) {
                            this.props.archiveGame(this.props.game);
                        }
                        this.props.exit();
                    }}>
                        Zurück zum Menü
                    </Button>
                    <Button style={{marginLeft: 10}} bsStyle='warning' onClick={() => this.props.undoDart()}>
                        Dart rückgängig machen
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }

}

Game.propTypes = {
    startScore: PropTypes.number.isRequired,
    checkInMode: PropTypes.object.isRequired,
    checkOutMode: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    winner: PropTypes.object,
    game: PropTypes.object.isRequired,
    addDart: PropTypes.func.isRequired,
    undoDart: PropTypes.func.isRequired,
    exit: PropTypes.func.isRequired,
    rematch: PropTypes.func.isRequired,
    archiveGame: PropTypes.func.isRequired,
    toggleSpeechOutput: PropTypes.func.isRequired,
    training: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    announcementText: PropTypes.string,
    speechOutputActive: PropTypes.bool.isRequired
};

export default Game

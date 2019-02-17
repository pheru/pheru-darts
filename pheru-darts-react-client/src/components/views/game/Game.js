import React from 'react'
import PlayerContainer from "../../../containers/views/game/PlayerContainer";
import {Button, Dropdown, Glyphicon, MenuItem, Modal, OverlayTrigger, Popover, Well} from "react-bootstrap";
import PropTypes from "prop-types";
import SpeechUtil from "../../../util/SpeechUtil";
import DocumentUtil from "../../../util/DocumentUtil";
import ScoreButtons from "./ScoreButtons";
import WindowUtil from "../../../util/WindowUtil";
import FullscreenButton from "../../general/FullscreenButton";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            landscapeOrientation: WindowUtil.isLandscapeOrientation(),
            gameFinishedModalShow: props.winner !== undefined,
            rematchStartingPlayer: props.players[props.players.length > 1 ? 1 : 0]
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
        //TODO refactoren (css, Komponenten, etc.)
        let upperContainerStyle = this.state.landscapeOrientation ? {
            height: "38%",
            display: "flex",
            flexGrow: 1
        } : {height: "37%"};
        let playerWrapperStyle = this.state.landscapeOrientation ? {
            paddingRight: 3,
            paddingBottom: 3,
            height: "100%",
            width: this.props.training ? "90%" : "45%"
        } : {
            height: this.props.training ? "100%" : "50%",
            width: "100%",
            paddingBottom: 3
        };
        let playerStyle = {height: "100%", width: "100%"};
        let buttonContainerStyle = this.state.landscapeOrientation ? {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "10%"
        } : {
            display: "flex", flexDirection: "row",
            height: "9%", width: "100%", paddingBottom: 3
        };
        let buttonStyle = this.state.landscapeOrientation ? {
            flexGrow: 1,
            width: "100%",
            marginBottom: 3,
            lineHeight: 0,
            fontSize: "6vh"
        } : {height: "100%", flexGrow: 1, fontSize: "4vh"};
        let popoverButtonStyle = {
            marginLeft: 3,
            marginRight: 3,
            fontSize: this.state.landscapeOrientation ? "8vh" : "6vh"
        };

        let buttonContainer = <div style={buttonContainerStyle}>
            <OverlayTrigger container={this} rootClose trigger="click"
                            placement={this.state.landscapeOrientation ? "left" : "top"}
                            overlay={
                                <Popover>
                                    <FullscreenButton bsStyle="primary" style={popoverButtonStyle}/>
                                    <Button bsStyle='primary' style={{
                                        ...popoverButtonStyle,
                                        transform: this.props.navigationBarVisible ? "" : "rotate(180deg)"
                                    }} onClick={this.props.toggleNavigationBar}>
                                        <Glyphicon glyph="eject"/>
                                    </Button>
                                    <Button bsStyle='primary' style={popoverButtonStyle}
                                            onClick={this.props.toggleSpeechOutput}>
                                        <Glyphicon
                                            glyph={this.props.speechOutputActive ? "volume-up" : "volume-off"}/>
                                    </Button>
                                </Popover>
                            }>
                <Button bsStyle='primary' style={{...buttonStyle, marginRight: 3}}>
                    <Glyphicon glyph="option-horizontal"/>
                </Button>
            </OverlayTrigger>
            <Button bsStyle='warning' style={buttonStyle}
                    onClick={() => this.props.undoDart()}>
                <Glyphicon glyph="erase"/>
            </Button>
        </div>;

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
                {this.state.landscapeOrientation && buttonContainer}
            </div>
            <div style={{height: this.state.landscapeOrientation ? "8%" : "12%", margin: 0, paddingBottom: 3}}>
                <Well style={{
                    display: "flex",
                    flexDirection: this.state.landscapeOrientation ? "row" : "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                    height: "100%",
                    margin: 0,
                    padding: 0,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontWeight: "bold",
                    fontSize: this.state.landscapeOrientation ? "4vh" : "3vh"
                }}>
                    {/*<div>Kein Checkout möglich</div>*/}
                    <div>
                        [{this.props.startScore}] - [{this.props.checkInMode.text}] - [{this.props.checkOutMode.text}]
                    </div>
                </Well>
            </div>
            {!this.state.landscapeOrientation && buttonContainer}
            <ScoreButtons style={{height: this.state.landscapeOrientation ? "54%" : "42%", width: "100%"}}
                          addDart={this.props.addDart}/>

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
    navigationBarVisible: PropTypes.bool.isRequired,
    addDart: PropTypes.func.isRequired,
    undoDart: PropTypes.func.isRequired,
    exit: PropTypes.func.isRequired,
    rematch: PropTypes.func.isRequired,
    archiveGame: PropTypes.func.isRequired,
    toggleNavigationBar: PropTypes.func.isRequired,
    toggleSpeechOutput: PropTypes.func.isRequired,
    training: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    announcementText: PropTypes.string,
    speechOutputActive: PropTypes.bool.isRequired
};

export default Game

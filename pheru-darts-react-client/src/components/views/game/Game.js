import React from 'react'
import PlayerContainer from "../../../containers/views/game/PlayerContainer";
import {Button, Dropdown, Glyphicon, MenuItem, Modal, OverlayTrigger, Popover, Well} from "react-bootstrap";
import PropTypes from "prop-types";
import SpeechUtil from "../../../util/SpeechUtil";
import DocumentUtil from "../../../util/DocumentUtil";
import ScoreButtons from "./ScoreButtons";
import FullscreenButton from "../../general/FullscreenButton";
import CheckOutUtil from "../../../util/CheckOutUtil";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";
import * as annyang from 'annyang';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameFinishedModalShow: props.winner !== undefined,
            rematchStartingPlayer: props.players[props.players.length > 1 ? 1 : 0]
        };
        this.modalBodyStyle = {
            textAlign: 'center'
        };
        this.handleGameFinishedModalClose = this.handleGameFinishedModalClose.bind(this);
        this.handleRematchStartingPlayerChanged = this.handleRematchStartingPlayerChanged.bind(this);
        this.addDartOnSpeech = this.addDartOnSpeech.bind(this);
        this.undoDartOnSpeech = this.undoDartOnSpeech.bind(this);
    }

    componentDidMount() {
        if (annyang) {
            let commands = {};
            let activationWordsAddDart = ["plus", "fluss"];
            for (const activationWord of activationWordsAddDart) {
                commands[activationWord + " *command"] = this.addDartOnSpeech;
            }
            let activationWordsUndoDart = ["minus"];
            for (const activationWord of activationWordsUndoDart) {
                commands[activationWord + " *command"] = this.undoDartOnSpeech;
                commands[activationWord] = this.undoDartOnSpeech;
            }
            annyang.setLanguage("de-DE");
            //TODO debug ausmachen
            annyang.debug(true);
            annyang.addCommands(commands);
            annyang.start();
        }

        DocumentUtil.setTitlePrefix(NAVIGATION_ITEM.GAME.text);
    }

    addDartOnSpeech(command) {
        let split = command.split(" ");
        for (let i = 0; i < split.length; i = i + 2) {
            if (split[i].toLowerCase() === "doppelball"
                || split[i].toLowerCase() === "doppelpuls") {
                i--;
                continue;
            }
            if (i + 1 >= split.length) {
                break;
            }
            console.log("multiplier: " + split[i].toLowerCase());
            let multiplier = this.multiplierFromSpeech(split[i].toLowerCase());
            if (multiplier > -1) {
                console.log("value: " + split[i + 1].toLowerCase());
                let value = this.numberFromSpeech(split[i + 1].toLowerCase());
                if (value > -1) {
                    this.props.addDart(value, multiplier);
                }
            }
        }
    }

    multiplierFromSpeech(multiplier) {
        switch (multiplier) {
            case "single":
            case "singles":
            case "zingel":
                return 1;
            case "doppel":
            case "double":
                return 2;
            case "triple":
            case "tripple":
                return 3;
            default:
                return -1;
        }
    }

    numberFromSpeech(value) {
        switch (value) {
            case "1":
            case "eins":
                return 1;
            case "2":
            case "zwei":
                return 2;
            case "3":
            case "drei":
                return 3;
            case "4":
            case "vier":
                return 4;
            case "5":
            case "fünf":
                return 5;
            case "6":
            case "sechs":
                return 6;
            case "7":
            case "sieben":
                return 7;
            case "8":
            case "acht":
                return 8;
            case "9":
            case "neun":
                return 9;
            case "10":
            case "zehn":
                return 10;
            case "11":
            case "elf":
                return 11;
            case "12":
            case "zwölf":
                return 12;
            case "13":
            case "dreizehn":
                return 13;
            case "14":
            case "vierzehn":
                return 14;
            case "15":
            case "fünfzehn":
                return 15;
            case "16":
            case "sechzehn":
                return 16;
            case "17":
            case "siebzehn":
                return 17;
            case "18":
            case "achtzehn":
                return 18;
            case "19":
            case "neunzehn":
                return 19;
            case "20":
            case "zwanzig":
                return 20;
            case "25":
            case "fünfundzwanzig":
            case "bull":
            case "ball":
                return 25;
            default:
                return -1;
        }
    }

    undoDartOnSpeech(amount) {
        let amountNumber = 1;
        if (amount) {
            amountNumber = this.numberFromSpeech(amount);
        }
        for (let i = 0; i < amountNumber; i++) {
            this.props.undoDart();
        }
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
        if (annyang) {
            console.log("Stop speechRec");
            annyang.abort();
        }
        this.props.setNavigationBarVisibility(true);
    }

    handleRematchStartingPlayerChanged(player) {
        this.setState({rematchStartingPlayer: player});
    }

    handleGameFinishedModalClose() {
        this.setState({gameFinishedModalShow: false});
    }

    render() {
        //TODO refactoren (css, Komponenten, etc.)
        let upperContainerStyle = this.props.landscapeOrientation ? {
            height: "38%",
            display: "flex",
            flexGrow: 1
        } : {height: "37%"};
        let playerWrapperStyle = this.props.landscapeOrientation ? {
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
        let buttonContainerStyle = this.props.landscapeOrientation ? {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "10%"
        } : {
            display: "flex", flexDirection: "row",
            height: "9%", width: "100%", paddingBottom: 3
        };
        let buttonStyle = this.props.landscapeOrientation ? {
            flexGrow: 1,
            width: "100%",
            marginBottom: 3,
            lineHeight: 0,
            fontSize: "6vh"
        } : {height: "100%", flexGrow: 1, fontSize: "4vh"};
        let popoverButtonStyle = {
            marginLeft: 3,
            marginRight: 3,
            fontSize: this.props.landscapeOrientation ? "8vh" : "6vh"
        };

        let buttonContainer = <div style={buttonContainerStyle}>
            <OverlayTrigger container={this} rootClose trigger="click"
                            placement={this.props.landscapeOrientation ? "left" : "top"}
                            overlay={
                                <Popover id="gamebuttons_popover">
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
                <Glyphicon glyph="repeat" style={{transform: "scaleX(-1)"}}/>
            </Button>
        </div>;

        return <div className="game" style={{height: "100%"}}>
            <div style={upperContainerStyle}>
                <div style={playerWrapperStyle}>
                    <PlayerContainer style={playerStyle} index={0}/>
                </div>
                {!this.props.training &&
                <div style={playerWrapperStyle}>
                    <PlayerContainer style={playerStyle} index={1}/>
                </div>
                }
                {this.props.landscapeOrientation && buttonContainer}
            </div>
            <div style={{height: this.props.landscapeOrientation ? "8%" : "12%", margin: 0, paddingBottom: 3}}>
                <Well style={{
                    display: "flex",
                    flexDirection: this.props.landscapeOrientation ? "row" : "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                    height: "100%",
                    margin: 0,
                    padding: 0,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontWeight: "bold",
                    fontSize: this.props.landscapeOrientation ? "4vh" : "3vh"
                }}>
                    <div>{CheckOutUtil.getPossibleCheckout(this.props.currentPlayerScore, this.props.currentPlayerDartsLeft,
                        this.props.checkInMode, this.props.checkOutMode, this.props.currentPlayerCheckinCondition)}</div>
                    <div>
                        [{this.props.startScore}] [{this.props.checkInMode.text}] [{this.props.checkOutMode.text}]
                    </div>
                </Well>
            </div>
            {!this.props.landscapeOrientation && buttonContainer}
            <ScoreButtons style={{height: this.props.landscapeOrientation ? "54%" : "42%", width: "100%"}}
                          addDart={this.props.addDart} landscapeOrientation={this.props.landscapeOrientation}/>

            <Modal dialogClassName='modal-bottom' show={this.state.gameFinishedModalShow}
                   onHide={this.handleGameFinishedModalClose}
                   keyboard={false} backdrop='static'>
                <Modal.Body style={this.modalBodyStyle}>
                    <h4>{this.props.winner !== undefined && this.props.winner.name} hat gewonnen!</h4>
                </Modal.Body>
                <Modal.Footer style={{textAlign: 'center'}}>
                    <Dropdown style={{display: 'inline-flex'}} id="rematch_player_dropdown">
                        <Button bsStyle='primary' style={{margin: 0, marginTop: 5}} onClick={() => {
                            if (this.props.isLoggedIn) {
                                this.props.archiveGame(this.props.game);
                            }
                            this.props.rematch(this.state.rematchStartingPlayer);
                        }}>
                            Rematch ({this.state.rematchStartingPlayer.name} beginnt)
                        </Button>
                        <Dropdown.Toggle bsStyle="primary" style={{margin: 0, marginRight: 5, marginTop: 5}}/>
                        <Dropdown.Menu style={{minWidth: '100%', textAlign: 'center'}}>
                            {this.props.players.map((player, i) =>
                                <MenuItem key={"rematch_player_" + i}
                                          onClick={() => this.handleRematchStartingPlayerChanged(player)}>
                                    {player.name} beginnt
                                </MenuItem>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button style={{margin: 0, marginRight: 5, marginTop: 5}} bsStyle='primary' onClick={() => {
                        if (this.props.isLoggedIn) {
                            this.props.archiveGame(this.props.game);
                        }
                        this.props.exit();
                    }}>
                        Zurück zum Menü
                    </Button>
                    <Button bsStyle='warning' style={{margin: 0, marginTop: 5}}
                            onClick={() => this.props.undoDart()}>
                        Dart rückgängig machen
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }


}

Game.propTypes = {
    landscapeOrientation: PropTypes.bool.isRequired,
    startScore: PropTypes.number.isRequired,
    checkInMode: PropTypes.object.isRequired,
    checkOutMode: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    currentPlayerScore: PropTypes.number.isRequired,
    currentPlayerDartsLeft: PropTypes.number.isRequired,
    currentPlayerCheckinCondition: PropTypes.bool.isRequired,
    winner: PropTypes.object,
    game: PropTypes.object.isRequired,
    navigationBarVisible: PropTypes.bool.isRequired,
    addDart: PropTypes.func.isRequired,
    undoDart: PropTypes.func.isRequired,
    exit: PropTypes.func.isRequired,
    rematch: PropTypes.func.isRequired,
    archiveGame: PropTypes.func.isRequired,
    toggleNavigationBar: PropTypes.func.isRequired,
    setNavigationBarVisibility: PropTypes.func.isRequired,
    toggleSpeechOutput: PropTypes.func.isRequired,
    training: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    announcementText: PropTypes.string,
    speechOutputActive: PropTypes.bool.isRequired
};

export default Game

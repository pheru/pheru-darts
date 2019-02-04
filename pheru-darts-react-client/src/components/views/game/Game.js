import React from 'react'
import PlayerContainer from "../../../containers/views/game/PlayerContainer";
import {Button, Col, Dropdown, Glyphicon, Grid, MenuItem, Modal, Row, Well} from "react-bootstrap";
import PropTypes from "prop-types";
import SpeechUtil from "../../../util/SpeechUtil";
import DocumentUtil from "../../../util/DocumentUtil";
import ScoreButtons from "./ScoreButtons";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
        this.handleGameFinishedModalClose = this.handleGameFinishedModalClose.bind(this);
        this.handleRematchStartingPlayerChanged = this.handleRematchStartingPlayerChanged.bind(this);
    }

    componentDidMount() {
        DocumentUtil.setTitlePrefix("Aktuelles Spiel");
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

    handleRematchStartingPlayerChanged(player) {
        this.setState({rematchStartingPlayer: player});
    }

    handleGameFinishedModalClose() {
        this.setState({gameFinishedModalShow: false});
    }

    render() {
        return <div style={{height: "100%"}}>
            <Grid>
                <Row className="show-grid text-center">
                    <Col xs={12} xsPush={0} sm={2} smPush={10} style={{...this.colStyle, marginBottom: 0}}>
                        <Row className="show-grid text-center">
                            <Col xs={5} sm={12}
                                 style={{...this.colStyleButton, fontWeight: 'bold'}}>
                                <Well style={{margin: 0, padding: 2}}>
                                    <div style={{borderBottom: '0.5px black solid'}}>{this.props.startScore}</div>
                                    <div>{this.props.checkInMode.text} {this.props.checkOutMode.text}</div>
                                </Well>
                            </Col>
                            <Col xs={5} sm={12} style={this.colStyleButton}>
                                <Button bsStyle='warning' bsSize='large' block
                                        onClick={() => this.props.undoDart()}>
                                    <Glyphicon glyph="erase"/>
                                </Button>
                            </Col>
                            <Col xs={2} sm={12} style={this.colStyleButton}>
                                <Button bsStyle='info' bsSize='large' block
                                        onClick={() => this.props.toggleSpeechOutput()}>
                                    <Glyphicon glyph={this.props.speechOutputActive ? "volume-up" : "volume-off"}/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} xsPull={0} sm={this.props.training ? 10 : 5} smPull={2} style={this.colStyle}>
                        <PlayerContainer index={0}/>
                    </Col>
                    {!this.props.training &&
                    <Col xs={12} xsPull={0} sm={5} smPull={2} style={this.colStyle}>
                        <PlayerContainer index={1}/>
                    </Col>
                    }
                </Row>
            </Grid>
            <ScoreButtons addDart={this.props.addDart}/>

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

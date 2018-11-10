import React from 'react'
import ScoreButtonsContainer from "../containers/ScoreButtonsContainer";
import PlayerContainer from "../containers/PlayerContainer";
import {Button, Col, Dropdown, Glyphicon, Grid, MenuItem, Modal, Row, Well} from "react-bootstrap";
import PropTypes from "prop-types";

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

    componentDidUpdate(prevProps) {
        if (this.props.players !== prevProps.players
            || this.props.winner !== prevProps.winner) {
            this.setState({
                rematchStartingPlayer: this.props.players[this.props.players.length > 1 ? 1 : 0],
                gameFinishedModalShow: this.props.winner !== undefined
            });
        }
    }

    handleRematchStartingPlayerChanged(player) {
        this.setState({rematchStartingPlayer: player});
    }

    handleGameFinishedModalClose() {
        this.setState({gameFinishedModalShow: false});
    }

    render() {
        return <div>
            <Grid>
                <Row className="show-grid text-center">
                    <Col xs={12} xsPush={0} sm={2} smPush={10} style={{...this.colStyle, marginBottom: 0}}>
                        <Row className="show-grid text-center">
                            <Col xs={5} xsOffset={1} sm={12} smOffset={0}
                                 style={{...this.colStyleButton, fontWeight: 'bold'}}>
                                <Well style={{margin: 0, padding: 2}}>
                                    <div style={{borderBottom: '0.5px black solid'}}>{this.props.startScore}</div>
                                    <div>{this.props.checkOutMode.text}</div>
                                </Well>
                            </Col>
                            <Col xs={5} sm={12} style={this.colStyleButton}>
                                <Button bsStyle='warning' bsSize='large' block
                                        onClick={() => this.props.undoDart()}>
                                    <Glyphicon glyph="erase"/>
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
            <ScoreButtonsContainer/>

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
    checkOutMode: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    winner: PropTypes.object,
    game: PropTypes.object.isRequired,
    undoDart: PropTypes.func.isRequired,
    exit: PropTypes.func.isRequired,
    rematch: PropTypes.func.isRequired,
    archiveGame: PropTypes.func.isRequired,
    training: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired
};

export default Game

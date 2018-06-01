import React from 'react'
import ScoreButtonsContainer from "../containers/ScoreButtonsContainer";
import PlayerContainer from "../containers/PlayerContainer";
import {Button, Col, Glyphicon, Grid, Modal, Row, Well} from "react-bootstrap";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameFinishedModalShow: props.finished,
            backToMenuModalShow: false
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
        this.handleBackToMenuModalShow = this.handleBackToMenuModalShow.bind(this);
        this.handleBackToMenuModalClose = this.handleBackToMenuModalClose.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {gameFinishedModalShow: props.finished};
    }

    handleGameFinishedModalClose() {
        this.setState({gameFinishedModalShow: false});
    }

    handleBackToMenuModalShow() {
        this.setState({backToMenuModalShow: true});
    }

    handleBackToMenuModalClose() {
        this.setState({backToMenuModalShow: false});
    }

    render() {
        return <div>
            <Grid>
                <Row className="show-grid text-center">
                    <Col xs={12} xsPush={0} sm={2} smPush={10} style={{...this.colStyle, marginBottom: 0}}>
                        <Row className="show-grid text-center">
                            <Col xs={4} xsOffset={1} sm={12} smOffset={0}
                                 style={{...this.colStyleButton, fontWeight: 'bold'}}>
                                <Well style={{margin: 0, padding: 2}}>
                                    <div style={{borderBottom:'0.5px black solid'}}>{this.props.startScore}</div>
                                    <div>{this.props.checkOutMode.text}</div>
                                </Well>
                            </Col>
                            <Col xs={3} sm={12} style={this.colStyleButton}>
                                <Button bsStyle='info' bsSize='large' block
                                        onClick={this.handleBackToMenuModalShow}>
                                    <Glyphicon glyph="home"/>
                                </Button>
                            </Col>
                            <Col xs={3} sm={12} style={this.colStyleButton}>
                                <Button bsStyle='warning' bsSize='large' block
                                        onClick={() => this.props.undoDart()}>
                                    <Glyphicon glyph="erase"/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} xsPull={0} sm={5} smPull={2} style={this.colStyle}>
                        <PlayerContainer index={0}/>
                    </Col>
                    <Col xs={12} xsPull={0} sm={5} smPull={2} style={this.colStyle}>
                        <PlayerContainer index={1}/>
                    </Col>
                </Row>
            </Grid>
            <ScoreButtonsContainer/>

            <Modal dialogClassName='modal-bottom' bsSize='small' show={this.state.gameFinishedModalShow}
                   onHide={this.handleGameFinishedModalClose}
                   keyboard={false} backdrop='static'>
                <Modal.Body style={this.modalBodyStyle}>
                    <h4>Gewonnen!</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='primary' onClick={() => this.props.rematch()}>Rematch</Button>
                    <Button bsStyle='primary' onClick={() => this.props.exit()}>Zurück zum Menü</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.backToMenuModalShow} onHide={this.handleBackToMenuModalClose}>
                <Modal.Body style={this.modalBodyStyle}>
                    <h4>Spiel beenden und zurück zum Menü?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{width: 100}} bsStyle="danger" onClick={() => this.props.exit()}>Ja</Button>
                    <Button style={{width: 100}} bsStyle='primary'
                            onClick={this.handleBackToMenuModalClose}>Nein</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }

}

Game.propTypes = {};

export default Game

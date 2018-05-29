import React from 'react'
import ScoreButtonsContainer from "../containers/ScoreButtonsContainer";
import PlayerContainer from "../containers/PlayerContainer";
import {Button, Col, Grid, Row} from "react-bootstrap";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.colStyle = {
            marginBottom: 15
        };

    }

    render() {
        return <div>
            <Grid>
                <Row className="show-grid text-center">
                    <Col xs={12} sm={6} style={this.colStyle}>
                        <PlayerContainer index={0}/>
                    </Col>
                    <Col xs={12} sm={6} style={this.colStyle}>
                        <PlayerContainer index={1}/>
                    </Col>
                </Row>
            </Grid>
            <ScoreButtonsContainer/>
            <Button bsStyle='warning' bsSize='large' style={{position: 'fixed', top: 4, right: 4}}
                    onClick={() => this.props.undoDart()}
            >Rückg.</Button>
        </div>
    }

}

Game.propTypes = {};

export default Game

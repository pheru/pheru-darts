import React from 'react'
import {Button, Col, Grid, Row} from "react-bootstrap";
import ToggleButton from "react-bootstrap/es/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import PropTypes from "prop-types";

class ScoreButtons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            multiplier: 1
        };
        this.colStyle = {
            margin: 0,
            padding: 0
        };

        this.toggleDouble = this.toggleDouble.bind(this);
        this.toggleTriple = this.toggleTriple.bind(this);
        this.addDart = this.addDart.bind(this);
    }

    render() {
        let cols = [];
        for (let i = 1; i <= 20; i++) {
            cols.push(<Col key={"scorebuttons_col_" + i} xs={3} sm={2} style={this.colStyle}>
                <Button className="score-button" onClick={() => this.addDart(i)} key={"scorebuttons_button_" + i} bsSize="large" bsStyle="primary" block>{i}</Button>
            </Col>)
        }
        return <Grid>
            <Row className="show-grid text-center">
                {cols}
                <Col xs={3} sm={2} style={this.colStyle}>
                    <Button className="score-button" onClick={() => this.addDart(25)} bsSize="large" bsStyle="primary" block>Bull</Button>
                </Col>
                <Col xs={3} sm={2} style={this.colStyle}>
                    <ToggleButtonGroup type="checkbox" value={this.state.multiplier} onChange={this.toggleDouble} block vertical>
                        <ToggleButton className="score-button" value={2} bsSize="large" bsStyle="success" block>
                            Double
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col xs={3} sm={2} style={this.colStyle}>
                    <ToggleButtonGroup type="checkbox" value={this.state.multiplier} onChange={this.toggleTriple} block vertical>
                        <ToggleButton className="score-button" value={3} bsSize="large" bsStyle="success" block>
                            Triple
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col xs={3} sm={2} style={this.colStyle}>
                    <Button className="score-button" onClick={() => this.addDart(0)} bsSize="large" bsStyle="danger" block>0</Button>
                </Col>
            </Row>
        </Grid>
    }

    addDart(value){
        this.props.addDart(value, this.state.multiplier);
        this.setState({
            multiplier: 1
        });
    }

    toggleDouble() {
        this.setState({
            multiplier: this.state.multiplier === 2 ? 1 : 2
        });
    }

    toggleTriple() {
        this.setState({
            multiplier: this.state.multiplier === 3 ? 1 : 3
        });
    }
}

ScoreButtons.propTypes = {
    addDart: PropTypes.func.isRequired
};

export default ScoreButtons

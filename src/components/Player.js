import React from 'react'
import {Col, Row} from "react-bootstrap";

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.borderRadius = 8;
        this.activeBorder = '10px solid #2196f3';
        this.blackBorder = '1px solid black';
        this.rowStyle = {
            margin: 0,
            padding: 0
        };
        this.colStyle = {
            margin: 0,
            padding: 0,
        };
        this.borderedColStyle = {
            ...this.colStyle,
            border: '1px solid #337ab7'
        };
        this.pStyle = {
            fontWeight: 'bold',
            margin: 0,
            padding: 0
        };
        this.pStyleSmall = {
            ...this.pStyle,
            fontSize: '3vw'
        };
        this.pStyleBig = {
            ...this.pStyle,
            fontSize: '5vw'
        };
    }

    render() {
        return <Row className="show-grid text-center"
                    style={this.props.current ? {
                            backgroundColor: 'white',
                            borderRadius: this.borderRadius,
                            margin: 0,
                            borderLeft: this.activeBorder,
                            borderRight: this.activeBorder
                        }
                        : {
                            backgroundColor: '#cadad8',
                            borderRadius: this.borderRadius,
                            margin: 0
                        }}>
            <Col xs={12} sm={12} style={{...this.colStyle, borderRadius: this.borderRadius}}>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={12} sm={12} style={{...this.colStyle, borderTopLeftRadius: this.borderRadius, borderTopRightRadius: this.borderRadius}}>
                        <p style={this.pStyleSmall}>{this.props.name}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={12} sm={12} style={this.colStyle}>
                        <p style={this.pStyleBig}>{this.props.score}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={6} sm={6}
                         style={{...this.colStyle, borderRight: this.blackBorder, borderTop: this.blackBorder}}>
                        <p style={this.pStyleSmall}># {this.props.dartCount}</p>
                    </Col>
                    <Col xs={6} sm={6} style={{...this.colStyle, borderTop: this.blackBorder}}>
                        <p style={this.pStyleSmall}>&empty; {this.props.average}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={4} sm={4}
                         style={{...this.colStyle, borderBottomLeftRadius: this.borderRadius, borderTop: this.blackBorder}}>
                        <p style={this.pStyleSmall}>{this.props.dart1}</p>
                    </Col>
                    <Col xs={4} sm={4} style={{
                        ...this.colStyle,
                        borderRight: this.blackBorder,
                        borderLeft: this.blackBorder,
                        borderTop: this.blackBorder
                    }}>
                        <p style={this.pStyleSmall}>{this.props.dart2}</p>
                    </Col>
                    <Col xs={4} sm={4}
                         style={{...this.colStyle, borderBottomRightRadius: this.borderRadius, borderTop: this.blackBorder}}>
                        <p style={this.pStyleSmall}>{this.props.dart3}</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
}

Player.propTypes = {};

export default Player

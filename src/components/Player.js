import React from 'react'
import {Col, Row} from "react-bootstrap";

class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
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
        this.pStyle3 = {
            fontSize: '3vw',
            fontWeight: 'bold',
            margin: 0,
            padding: 0
        };
        this.pStyle5 = {
            fontSize: '5vw',
            fontWeight: 'bold',
            margin: 0,
            padding: 0
        };

    }

    render() {
        return <Row className="show-grid text-center"
                    style={this.props.current ? {backgroundColor: '#5bc0de', borderRadius: 20} : {backgroundColor: '#EDFFFC', borderRadius: 20}}>
            <Col xs={12} sm={12} style={{...this.borderedColStyle, borderRadius: 20}}>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={12} sm={12} style={{...this.borderedColStyle, borderTopLeftRadius: 18, borderTopRightRadius: 18}}>
                        <p style={this.pStyle3}>{this.props.name}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={12} sm={12} style={this.borderedColStyle}>
                        <p style={this.pStyle5}>{this.props.score}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={6} sm={6} style={this.borderedColStyle}>
                        <p style={this.pStyle3}># {this.props.dartCount}</p>
                    </Col>
                    <Col xs={6} sm={6} style={this.borderedColStyle}>
                        <p style={this.pStyle3}>&empty; {this.props.average}</p>
                    </Col>
                </Row>
                <Row className="show-grid text-center" style={this.rowStyle}>
                    <Col xs={4} sm={4} style={{...this.borderedColStyle, borderBottomLeftRadius: 18}}>
                        <p style={this.pStyle3}>{this.props.dart1}</p>
                    </Col>
                    <Col xs={4} sm={4} style={this.borderedColStyle}>
                        <p style={this.pStyle3}>{this.props.dart2}</p>
                    </Col>
                    <Col xs={4} sm={4} style={{...this.borderedColStyle, borderBottomRightRadius: 18}}>
                        <p style={this.pStyle3}>{this.props.dart3}</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
}

Player.propTypes = {};

export default Player

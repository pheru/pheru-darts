import React from 'react'
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import WindowUtil from "../../../util/WindowUtil";

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

    addDart(value) {
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

    render() {
        let rows = [];
        let rowCount = WindowUtil.isLandscapeOrientation() ? 4 : 6;
        let buttonsPerRow = WindowUtil.isLandscapeOrientation() ? 6 : 4;
        let rowHeight = 100.0 / rowCount + "%";
        let buttonStyle = {
            height: "100%",
            width: 100.0 / buttonsPerRow + "%",
            lineHeight: 0,
            fontSize: WindowUtil.isLandscapeOrientation() ? "6vh" : "5vh"
        };

        let buttons = {};
        for (let i = 1; i <= 20; i++) {
            buttons[i - 1] =
                <Button style={buttonStyle} className="score-button" onClick={() => this.addDart(i)} key={"scorebuttons_button_" + i}
                        bsStyle="primary" >{i}</Button>;
        }
        buttons[20] =
            <Button style={buttonStyle} className="score-button" onClick={() => this.addDart(25)} bsStyle="primary">
                Bull
            </Button>;
        buttons[21] =
            <Button style={buttonStyle} className={"score-button" + (this.state.multiplier === 2 ? " multiplier-toggled" : "")}
                    onClick={this.toggleDouble} bsStyle="success">
                Double
            </Button>;
        buttons[22] =
            <Button style={buttonStyle} className={"score-button" + (this.state.multiplier === 3 ? " multiplier-toggled" : "")}
                    onClick={this.toggleTriple} bsStyle="success">
                Triple
            </Button>;
        buttons[23] =
            <Button style={buttonStyle} className="score-button" onClick={() => this.addDart(0)} bsStyle="danger" >
                0
            </Button>;

        for (let i = 0; i < rowCount; i++) {
            let rowButtons = [];
            for (let j = i * buttonsPerRow; j < (i * buttonsPerRow) + buttonsPerRow; j++) {
                rowButtons.push(buttons[j]);
            }
            rows.push(<div style={{height: rowHeight, width: "100%"}}>{rowButtons}</div>)
        }
        return <div style={{...this.props.style}}>
            {rows}
        </div>
    }
}

ScoreButtons.propTypes = {
    addDart: PropTypes.func.isRequired
};

export default ScoreButtons
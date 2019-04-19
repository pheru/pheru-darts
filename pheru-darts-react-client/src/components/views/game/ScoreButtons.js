import React from 'react'
import {Button} from "react-bootstrap";
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

    addDart(value) {
        this.props.addDart(value, this.state.multiplier);
        this.setState({
            multiplier: 1
        });
    }

    toggleDouble() {
        document.getElementById("audio_scorebutton_click").play();
        this.setState({
            multiplier: this.state.multiplier === 2 ? 1 : 2
        });
    }

    toggleTriple() {
        document.getElementById("audio_scorebutton_click").play();
        this.setState({
            multiplier: this.state.multiplier === 3 ? 1 : 3
        });
    }

    render() {
        let rows = [];
        let rowCount = this.props.landscapeOrientation ? 4 : 6;
        let buttonsPerRow = this.props.landscapeOrientation ? 6 : 4;
        let rowHeight = 100.0 / rowCount + "%";
        let buttonStyle = {
            height: "100%",
            width: 100.0 / buttonsPerRow + "%",
            lineHeight: 0,
            fontSize: this.props.landscapeOrientation ? "6vh" : "3vh"
        };

        let buttons = {};
        for (let i = 1; i <= 20; i++) {
            buttons[i - 1] =
                <Button style={{...buttonStyle}} className="score-button" onClick={() => this.addDart(i)}
                        key={"scorebuttons_button_" + i} bsStyle="primary">
                    {i}
                </Button>;
        }
        buttons[20] =
            <Button style={{...buttonStyle}} className="score-button" onClick={() => this.addDart(25)}
                    key="scorebuttons_button_25" bsStyle="primary">
                Bull
            </Button>;
        buttons[21] =
            <Button style={{...buttonStyle}}
                    className={"score-button" + (this.state.multiplier === 2 ? " multiplier-toggled" : "")}
                    onClick={this.toggleDouble} bsStyle="success" key="scorebuttons_button_double">
                Double
            </Button>;
        buttons[22] =
            <Button style={{...buttonStyle}}
                    className={"score-button" + (this.state.multiplier === 3 ? " multiplier-toggled" : "")}
                    onClick={this.toggleTriple} bsStyle="success" key="scorebuttons_button_triple">
                Triple
            </Button>;
        buttons[23] =
            <Button style={{...buttonStyle}} className="score-button" onClick={() => this.addDart(0)}
                    bsStyle="danger" key="scorebuttons_button_0">
                0
            </Button>;

        for (let i = 0; i < rowCount; i++) {
            let rowButtons = [];
            for (let j = i * buttonsPerRow; j < (i * buttonsPerRow) + buttonsPerRow; j++) {
                rowButtons.push(buttons[j]);
            }
            rows.push(<div style={{height: rowHeight, width: "100%"}} key={"scorebuttons_row_" + i}>{rowButtons}</div>)
        }
        rows[0].props.children[0].props.style.borderTopLeftRadius = 4;
        rows[0].props.children[rows[0].props.children.length - 1].props.style.borderTopRightRadius = 4;
        rows[rows.length - 1].props.children[0].props.style.borderBottomLeftRadius = 4;
        rows[rows.length - 1].props.children[rows[rows.length - 1].props.children.length - 1].props.style.borderBottomRightRadius = 4;
        return <div style={{...this.props.style}}>
            {rows}
        </div>
    }
}

ScoreButtons.propTypes = {
    landscapeOrientation: PropTypes.bool.isRequired,
    addDart: PropTypes.func.isRequired
};

export default ScoreButtons
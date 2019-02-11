import React from 'react'
import PropTypes from "prop-types";
import DropdownTextfield from "./DropdownTextfield";

const SCORE_CHOICES = ["101", "201", "301", "401", "501", "1001"];

class ScoreInput extends React.Component {

    constructor(props) {
        super(props);
        this.handleScoreChange = this.handleScoreChange.bind(this);
    }

    handleScoreChange(value) {
        if (value !== "" && !ScoreInput.isValidScore(value)) {
            return;
        }
        this.props.onChange(value);
    }

    static isValidScore(value) {
        return /^[1-9]+\d*$/.test(value);
    }

    render() {
        return <DropdownTextfield id={this.props.id}
                                  value={this.props.value}
                                  choices={this.props.noChoices ? [] : SCORE_CHOICES}
                                  onDropdownClick={this.handleScoreChange}
                                  onInputChange={this.handleScoreChange}/>
    }

}

ScoreInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    noChoices: PropTypes.bool
};

export default ScoreInput
import React from 'react'
import PropTypes from "prop-types";
import {FormControl} from "react-bootstrap";

class Select extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        // this.props.onChange(value); TODO in Arbeit
    }

    render() {
        return <FormControl componentClass="select"
                            style={this.props.style}
                            onChange={this.handleChange}
                            value={this.props.value}>
            {this.props.choices.map(choice => {
                    let key = this.props.keyPrefix + choice;
                    return <option key={key} value={choice}>{choice}</option>
                }
            )}
        </FormControl>
    }

}

Select.propTypes = {
    keyPrefix: PropTypes.string,
    value: PropTypes.string,
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func
};

export default Select
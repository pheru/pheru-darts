import React from 'react'
import {Button, Glyphicon} from "react-bootstrap";
import PropTypes from 'prop-types';

class ButtonTile extends React.Component {

    render() {
        return <Button bsStyle="primary"
                       disabled={this.props.disabled}
                       style={{
                           margin: 5,
                           fontSize: 40,
                           display: "inherit",
                           ...this.props.style
                       }}
                       onClick={this.props.onClick}>
            {this.props.icon}
            {this.props.text}
            {this.props.children}
        </Button>
    }
}

ButtonTile.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.element,
    text: PropTypes.string,
    route: PropTypes.string,
    disabled: PropTypes.bool
};

export default ButtonTile
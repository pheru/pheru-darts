import React from 'react'
import {Button, Glyphicon} from "react-bootstrap";
import PropTypes from 'prop-types';

class Tile extends React.Component {

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
            <Glyphicon glyph={this.props.glyph}/>
            {this.props.text}
            {this.props.children}
        </Button>
    }
}

Tile.propTypes = {
    onClick: PropTypes.func,
    glyph: PropTypes.string,
    text: PropTypes.string,
    route: PropTypes.string,
    disabled: PropTypes.bool
};

export default Tile
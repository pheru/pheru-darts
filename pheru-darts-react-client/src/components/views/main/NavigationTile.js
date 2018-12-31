import React from 'react'
import PropTypes from 'prop-types';
import Tile from "./Tile";

class NavigationTile extends React.Component {

    render() {
        return <Tile style={this.props.style}
                     onClick={() => this.props.history.push(this.props.navigationItem.route)}
                     glyph={this.props.navigationItem.icon}
                     text={this.props.navigationItem.text}
                     disabled={this.props.disabled}>
            {this.props.children}
        </Tile>
    }
}

NavigationTile.propTypes = {
    history: PropTypes.object.isRequired,
    navigationItem: PropTypes.object.isRequired,
    disabled: PropTypes.bool
};

export default NavigationTile
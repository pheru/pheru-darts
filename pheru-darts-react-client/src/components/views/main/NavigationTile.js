import React from 'react'
import PropTypes from 'prop-types';
import ButtonTile from "./ButtonTile";

class NavigationTile extends React.Component {

    render() {
        return <ButtonTile style={this.props.style}
                           onClick={() => this.props.history.push(this.props.navigationItem.route)}
                           icon={this.props.navigationItem.icon}
                           text={this.props.navigationItem.text}
                           disabled={this.props.disabled}>
            {this.props.children}
        </ButtonTile>
    }
}

NavigationTile.propTypes = {
    history: PropTypes.object.isRequired,
    navigationItem: PropTypes.object.isRequired,
    disabled: PropTypes.bool
};

export default NavigationTile
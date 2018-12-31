import React from 'react'
import {Glyphicon} from "react-bootstrap";
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";

class NavigationBarItem extends React.Component {

    render() {
        return <NavLink className="navigation-bar-item" to={this.props.navigationItem.route}>
            <Glyphicon glyph={this.props.navigationItem.icon}/> {(this.props.showText === undefined || this.props.showText) && this.props.navigationItem.text}
            {this.props.children}
        </NavLink>
    }
}

NavigationBarItem.propTypes = {
    showText: PropTypes.bool,
    navigationItem: PropTypes.object.isRequired
};

export default NavigationBarItem
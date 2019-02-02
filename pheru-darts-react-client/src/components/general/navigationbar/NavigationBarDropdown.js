import React from 'react'
import {Dropdown} from "react-bootstrap";
import CustomDropDownMenuItem from "../CustomDropDownMenuItem";
import PropTypes from "prop-types";

class NavigationBarDropdown extends React.Component {
    render() {
        let menuClassName = this.props.right ? "navigation-bar-dropdown-menu-right" : "";
        menuClassName = this.props.fullWidth ? "navigation-bar-dropdown-menu-full-width" : menuClassName;
        return <Dropdown id={this.props.id}>
            <Dropdown.Toggle noCaret={!this.props.withCaret}
                             className={this.props.withCaret ? "navigation-bar-dropdown-toggle" : "navigation-bar-bordered-item"}>
                {this.props.icon} {this.props.text}
            </Dropdown.Toggle>
            <Dropdown.Menu className={menuClassName}>
                {this.props.items.map((item, i) =>
                    <CustomDropDownMenuItem key={this.props.id + "_item_" + i}>
                        {item}
                    </CustomDropDownMenuItem>
                )}
            </Dropdown.Menu>
        </Dropdown>
    }
}

NavigationBarDropdown.propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    icon: PropTypes.element,
    text: PropTypes.string,
    withCaret: PropTypes.bool,
    right: PropTypes.bool,
    fullWidth: PropTypes.bool
};

export default NavigationBarDropdown;
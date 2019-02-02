import React from 'react'

/**
 * Wird benötigt, da das bootstrap-MenuItem ein a-tag rendered,
 * welches dadurch keine weiteren a-tags als children haben kann.
 */
class CustomDropDownMenuItem extends React.Component {
    render() {
        return <div role="menuitem" onClick={this.props.onSelect}>
            {this.props.children}
        </div>
    }
}

CustomDropDownMenuItem.propTypes = {};

export default CustomDropDownMenuItem;
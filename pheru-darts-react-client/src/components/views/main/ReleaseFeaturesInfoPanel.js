import React from 'react'
import PropTypes from 'prop-types';
import {Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";

class ReleaseFeaturesInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="info">
            {/*overflow nötig, damit die Höhe der Elemente mit float beachtet wird*/}
            <Panel.Heading style={{overflow: "auto"}}>
                <div style={{float: "left"}}><Glyphicon glyph="check"/> {this.props.version}</div>
                <div style={{float: "right"}}>{this.props.date}</div>
            </Panel.Heading>
            <Panel.Body>
                <ul>
                    {this.props.children}
                </ul>
            </Panel.Body>
        </Panel>
    }
}

ReleaseFeaturesInfoPanel.propTypes = {
    version: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
};

export default ReleaseFeaturesInfoPanel
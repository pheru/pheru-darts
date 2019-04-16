import React from 'react'
import PropTypes from 'prop-types';
import {Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import RELEASES from "../../../releases";
import {NavLink} from "react-router-dom";
import {NAVIGATION_ITEM} from "../../../constants/navigationItems";

const Truncation = (props) =>
    <NavLink to={NAVIGATION_ITEM.ABOUT.route}>
        <div style={{
            ...props.style,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Glyphicon glyph="option-vertical" style={{fontSize: 30}}/>
            Alle Änderungen ansehen
        </div>
    </NavLink>
;

class NewFeaturesInfoPanel extends React.Component {

    render() {
        let minorRendered = false;
        let minorTruncateRendered = false;
        let majorRendered = false;
        let majorTruncateRendered = false;
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="flash"/> Was ist neu?
            </Panel.Heading>
            <Panel.Body>
                {RELEASES.map(release => {
                    if (!this.props.truncated) {
                        return release;
                    }
                    if (release.props.majorRelease) {
                        if (!majorRendered) {
                            majorRendered = true;
                            return release;
                        } else if (!majorTruncateRendered) {
                            majorTruncateRendered = true;
                            return <Truncation style={{marginTop: 7}} key="major-truncation"/>;
                        }
                    } else {
                        if (!majorRendered && !minorRendered) {
                            minorRendered = true;
                            return release;
                        } else if (!majorRendered && !minorTruncateRendered) {
                            minorTruncateRendered = true;
                            return <Truncation style={{marginBottom: 7}} key="minor-truncation"/>;
                        }
                    }
                    return null;
                })}
            </Panel.Body>
        </Panel>
    }
}

NewFeaturesInfoPanel.propTypes = {
    truncated: PropTypes.bool
};

export default NewFeaturesInfoPanel;
import React from 'react'
import {Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import {FaMicrophone, FaTrophy} from "react-icons/fa";

class PlannedFeaturesInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="road"/> Was ist geplant?
            </Panel.Heading>
            <Panel.Body>
                <ul>
                    <li><Glyphicon glyph="bullhorn"/> Soundeffekte</li>
                    <li><Glyphicon glyph="play-circle"/> Neuer Spielmodus: Cricket</li>
                    <li><Glyphicon glyph="play-circle"/> Mehr als zwei Spieler gleichzeitig</li>
                    <li><Glyphicon glyph="play-circle"/> Weitere Spielkonfiguration: Sets & Legs</li>
                    <li><FaTrophy/> Turniermodus mit Gruppenphase & KO-Runde</li>
                    <li><FaMicrophone/> Sprachsteuerung</li>
                    <li><Glyphicon glyph="stats"/> Statistiken verbessern:</li>
                    <ul>
                        <li>Layout auf Mobilgeräten anpassen</li>
                        <li>Einzelspielstatistiken</li>
                        <li>Schnellfilter</li>
                        <li>Detailliertere Aufnahmestatistiken</li>
                    </ul>
                    <li><Glyphicon glyph="time"/> Stoppuhr & Timer</li>
                </ul>
            </Panel.Body>
        </Panel>
    }
}

PlannedFeaturesInfoPanel.propTypes = {};

export default PlannedFeaturesInfoPanel
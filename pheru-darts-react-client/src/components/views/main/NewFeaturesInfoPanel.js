import React from 'react'
import {Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import ReleaseFeaturesInfoPanel from "./ReleaseFeaturesInfoPanel";
import {FaMoon} from "react-icons/fa";

class NewFeaturesInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="flash"/> Was ist neu?
            </Panel.Heading>
            <Panel.Body>
                <ReleaseFeaturesInfoPanel version="2.0" date="31.03.2019">
                    <li>
                        <Glyphicon glyph="home"/> Überarbeitete Startseite mit Übersicht aller Features
                        und Neuerungen
                    </li>
                    <li><Glyphicon glyph="phone"/> Verbessertes Design für Mobilgeräte</li>
                    <li><Glyphicon glyph="stats"/> Neue Statistiken für Aufnahmen</li>
                    <li><Glyphicon glyph="filter"/> Statistiken können jetzt gefilter werden</li>
                    <li><Glyphicon glyph="screenshot"/> Finish-Anzeige während des Spiels</li>
                    <li><FaMoon/> Darktheme verfügbar (klicke auf das Symbol in der linken oberen Ecke
                        zum Wechseln des Designs)
                    </li>
                    <li>
                        <Glyphicon glyph="eject"/> Möglichkeit zum Ausblenden der Navigationsleiste während eines Spiels
                    </li>
                </ReleaseFeaturesInfoPanel>
            </Panel.Body>
        </Panel>
    }
}

NewFeaturesInfoPanel.propTypes = {};

export default NewFeaturesInfoPanel
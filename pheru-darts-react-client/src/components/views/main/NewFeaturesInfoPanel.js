import React from 'react'
import {Panel} from "react-bootstrap";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import ReleaseFeaturesInfoPanel from "./ReleaseFeaturesInfoPanel";

class NewFeaturesInfoPanel extends React.Component {

    render() {
        return <Panel bsStyle="primary">
            <Panel.Heading>
                <Glyphicon glyph="flash"/> Was ist neu?
            </Panel.Heading>
            <Panel.Body>
                <ReleaseFeaturesInfoPanel version="2.0.0" date="TODO">
                    <li>
                        <Glyphicon glyph="home"/> Überarbeitete Startseite mit Übersicht aller Features
                        und Neuerungen
                    </li>
                    <li><Glyphicon glyph="phone"/> Verbessertes Design für Mobilgeräte</li>
                    <li><Glyphicon glyph="stats"/> Neue Statistiken für Aufnahmen</li>
                    <li><Glyphicon glyph="filter"/> Statistiken können jetzt gefilter werden</li>
                    <li><Glyphicon glyph="screenshot"/> Finish-Anzeige während des Spiels</li>
                </ReleaseFeaturesInfoPanel>
            </Panel.Body>
        </Panel>
    }
}

NewFeaturesInfoPanel.propTypes = {};

export default NewFeaturesInfoPanel
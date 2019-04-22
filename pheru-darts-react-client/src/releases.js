import ReleaseFeaturesInfoPanel from "./components/views/main/ReleaseFeaturesInfoPanel";
import Glyphicon from "react-bootstrap/es/Glyphicon";
import {FaMoon} from "react-icons/fa";
import React from "react";

export default [
    <ReleaseFeaturesInfoPanel key="release_2.1" version="2.1" date="XX.XX.2019">
        <li><Glyphicon glyph="play-circle"/> Neue Check-Out-Option: Master-Out</li>
        <li><Glyphicon glyph="bullhorn"/> Soundeffekte</li>
    </ReleaseFeaturesInfoPanel>,
    <ReleaseFeaturesInfoPanel key="release_2.0" style={{marginBottom: 0}} majorRelease version="2.0" date="31.03.2019">
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
];
import React from 'react'
import {Glyphicon} from "react-bootstrap";

class NavigationItem {
    constructor(text, icon, route) {
        this.text = text;
        this.icon = icon;
        this.route = route;
    }
}

const SETTINGS_PATH = "/settings";

export const NAVIGATION_ITEM = {
    NEW_GAME: new NavigationItem("Neues Spiel", <Glyphicon glyph="edit"/>, "/newgame"),
    NEW_TRAINING: new NavigationItem("Training", <Glyphicon glyph="upload"/>,"/newtraining"),
    GAME: new NavigationItem("Aktuelles Spiel", <Glyphicon glyph="play-circle"/>, "/game"),
    NOTIFICATIONS: new NavigationItem("Mitteilungen", <Glyphicon glyph="bell"/>, "/notifications"),
    STATISTICS: new NavigationItem("Statistiken", <Glyphicon glyph="stats"/>, "/statistics"),
    SETTINGS: new NavigationItem("Einstellungen", <Glyphicon glyph="cog"/>, SETTINGS_PATH),
    SETTINGS_USER: new NavigationItem("Benutzereinstellungen", <Glyphicon glyph="user"/>, SETTINGS_PATH + "/user"),
    SETTINGS_SPEECH: new NavigationItem("Spracheinstellungen", <Glyphicon glyph="volume-up"/>, SETTINGS_PATH + "/speech"),
    SETTINGS_PERMISSIONS: new NavigationItem("Berechtigungen", <Glyphicon glyph="list-alt"/>, SETTINGS_PATH + "/permissions"),
    ABOUT: new NavigationItem("Info", <Glyphicon glyph="info-sign"/>, "/about"),
    BRACKET: new NavigationItem("Turnierbaum", <Glyphicon glyph="info-sign"/>, "/bracket"),

    LOGIN: new NavigationItem("Anmelden", <Glyphicon glyph="log-in"/>),
    LOGOUT: new NavigationItem("Abmelden", <Glyphicon glyph="log-out"/>)
};
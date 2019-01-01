import React from 'react'
import {Glyphicon} from "react-bootstrap";

class NavigationItem {
    constructor(text, icon, route) {
        this.text = text;
        this.icon = icon;
        this.route = route;
    }
}

export const NAVIGATION_ITEM = {
    NEW_GAME: new NavigationItem("Neues Spiel", <Glyphicon glyph="edit"/>, "/newgame"),
    NEW_TRAINING: new NavigationItem("Training", <Glyphicon glyph="upload"/>,"/newtraining"),
    GAME: new NavigationItem("Aktuelles Spiel", <Glyphicon glyph="play-circle"/>, "/game"),
    NOTIFICATIONS: new NavigationItem("Mitteilungen", <Glyphicon glyph="bell"/>, "/notifications"),
    STATISTICS: new NavigationItem("Statistiken", <Glyphicon glyph="stats"/>, "/statistics"),
    SETTINGS: new NavigationItem("Einstellungen", <Glyphicon glyph="cog"/>, "/settings"),
    ABOUT: new NavigationItem("Info", <Glyphicon glyph="info-sign"/>, "/about"),

    LOGIN: new NavigationItem("Anmelden", <Glyphicon glyph="log-in"/>),
    LOGOUT: new NavigationItem("Abmelden", <Glyphicon glyph="log-out"/>)
};
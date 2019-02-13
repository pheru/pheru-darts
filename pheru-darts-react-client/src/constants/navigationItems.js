import React from 'react'
import {
    FaBell,
    FaChartPie,
    FaCog,
    FaEdit,
    FaInfoCircle,
    FaListAlt,
    FaPlay,
    FaRunning,
    FaSignInAlt,
    FaSignOutAlt,
    FaUserCog,
    FaVolumeUp
} from "react-icons/fa";

class NavigationItem {
    constructor(text, icon, route) {
        this.text = text;
        this.icon = icon;
        this.route = route;
    }
}

const SETTINGS_PATH = "/settings";

export const NAVIGATION_ITEM = {
    NEW_GAME: new NavigationItem("Neues Spiel", <FaEdit/>, "/newgame"),
    NEW_TRAINING: new NavigationItem("Training", <FaRunning/>,"/newtraining"),
    GAME: new NavigationItem("Aktuelles Spiel", <FaPlay/>, "/game"),
    NOTIFICATIONS: new NavigationItem("Mitteilungen", <FaBell/>, "/notifications"),
    STATISTICS: new NavigationItem("Statistiken", <FaChartPie/>, "/statistics"),
    SETTINGS: new NavigationItem("Einstellungen", <FaCog/>, SETTINGS_PATH),
    SETTINGS_USER: new NavigationItem("Benutzereinstellungen", <FaUserCog/>, SETTINGS_PATH + "/user"),
    SETTINGS_SPEECH: new NavigationItem("Spracheinstellungen", <FaVolumeUp/>, SETTINGS_PATH + "/speech"),
    SETTINGS_PERMISSIONS: new NavigationItem("Berechtigungen", <FaListAlt/>, SETTINGS_PATH + "/permissions"),
    ABOUT: new NavigationItem("Info", <FaInfoCircle/>, "/about"),

    LOGIN: new NavigationItem("Anmelden", <FaSignInAlt/>),
    LOGOUT: new NavigationItem("Abmelden", <FaSignOutAlt/>)
};
class NavigationItem {
    constructor(text, icon, route) {
        this.text = text;
        this.icon = icon;
        this.route = route;
    }
}

export const NAVIGATION_ITEM = {
    NEW_GAME: new NavigationItem("Neues Spiel", "edit", "/newgame"),
    NEW_TRAINING: new NavigationItem("Training", "upload", "/newtraining"),
    GAME: new NavigationItem("Aktuelles Spiel", "play-circle", "/game"),
    NOTIFICATIONS: new NavigationItem("Mitteilungen", "bell", "/notifications"),
    STATISTICS: new NavigationItem("Statistiken", "stats", "/statistics"),
    SETTINGS: new NavigationItem("Einstellungen", "cog", "/settings"),
    ABOUT: new NavigationItem("Info", "info-sign", "/about"),

    LOGIN: new NavigationItem("Anmelden","log-in"),
    LOGOUT: new NavigationItem("Abmelden","log-out")
};
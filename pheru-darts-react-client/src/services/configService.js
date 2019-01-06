const PRODUCTION_CLIENT_HOSTNAME = "pheru.github.io";
const PRODUCTION_HOST = "https://darts.pheru.de";

const DEV_PROTOCOL = "https:";
const DEV_PORT = "8443";

export function getConfig() {
    if (window.location.hostname === PRODUCTION_CLIENT_HOSTNAME) {
        return configForHost(PRODUCTION_HOST);
    } else {
        return configForHost(devHostForHostname(window.location.hostname));
    }
}

function devHostForHostname(hostname) {
    return DEV_PROTOCOL + "//" + hostname + ":" + DEV_PORT;
}

function configForHost(host) {
    return {
        resourceUrls: {
            user: host + "/user",
            playerPermission: host + "/playerPermission",
            game: host + "/game",
            statistic: host + "/statistic",
            serverInformation: host + "/serverInformation",
            notification: host + "/notification"
        },
        loginUrl: host + "/login",
        logoutUrl: host + "/logout"
    };
}
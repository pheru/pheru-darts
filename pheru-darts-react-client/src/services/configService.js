const LOCAL_PROTOCOL = "https:";
const LOCAL_HOSTNAME = "localhost";
const LOCAL_PORT = "8443";
const LOCAL_HOST = LOCAL_PROTOCOL + "//" + LOCAL_HOSTNAME + ":" + LOCAL_PORT;

const PRODUCTION_HOST = "https://darts.pheru.de";

const LOCAL = defaultConfigForHost(LOCAL_HOST);
const PRODUCTION = defaultConfigForHost(PRODUCTION_HOST);

function defaultConfigForHost(host) {
    return {
        resourceUrls: {
            user: host + "/user",
            playerPermission: host + "/playerPermission",
            game: host + "/game",
            statistic: host + "/statistic",
            serverInformation: host + "/serverInformation"
        },
        loginUrl: host + "/login",
        logoutUrl: host + "/logout"
    };
}

export function getConfig() {
    switch (window.location.hostname) {
        case LOCAL_HOSTNAME:
            return LOCAL;
        default:
            return PRODUCTION;
    }
}
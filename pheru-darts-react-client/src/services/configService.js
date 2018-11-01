const LOCAL_PROTOCOL = "http:";
const LOCAL_HOSTNAME = "localhost";
const LOCAL_PORT = "8080";
const LOCAL_HOST = LOCAL_PROTOCOL + "//" + LOCAL_HOSTNAME + ":" + LOCAL_PORT;
const LOCAL = {
    resourceUrls: {
        user: LOCAL_HOST + "/user",
        playerPermission: LOCAL_HOST + "/playerPermission",
        game: LOCAL_HOST + "/game",
        statistic: LOCAL_HOST + "/statistic"
    },
    loginUrl: LOCAL_HOST + "/login",
    logoutUrl: LOCAL_HOST + "/logout"
};
const PRODUCTION = LOCAL;

export function getConfig() {
    switch (window.location.hostname) {
        case LOCAL_HOSTNAME:
            return LOCAL;
        default:
            return PRODUCTION;
    }
}
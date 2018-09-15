const LOCAL = {
    resourceUrls: {
        users: "http://localhost:8080/users",
        playerPermission: "http://localhost:8080/playerPermission",
        games: "http://localhost:8080/games",
        statistics: "http://localhost:8080/statistics"
    },
    loginUrl : "http://localhost:8080/login",
    logoutUrl : "http://localhost:8080/logout",
    signUpUrl : "http://localhost:8080/sign-up"
};
const PRODUCTION = LOCAL;

export function getConfig() {
    switch (window.location.hostname) {
        case "localhost":
            return LOCAL;
        default:
            return PRODUCTION;
    }
}


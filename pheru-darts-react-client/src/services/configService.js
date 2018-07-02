const LOCAL = {
    resourceUrls: {
        users: "http://localhost:8080/users",
        playerPermission: "http://localhost:8080/playerPermission"
    },
    loginUrl : "http://localhost:8080/login",
    logoutUrl : "http://localhost:8080/logout",
    signUpUrl : "http://localhost:8080/sign-up"
};
const LOCAL_ERROR = {
    resourceUrls: {
        users: "http://localhost:8080/testfehler",
        playerPermission: "http://localhost:8080/testfehler"
    },
    loginUrl : "http://localhost:8080/testfehler",
    logoutUrl : "http://localhost:8080/testfehler",
    signUpUrl : "http://localhost:8080/testfehler"
};
const PRODUCTION = LOCAL;

const LOCAL_ERROR_MODE_STRING = "testmodefail";

export function getConfig() {
    switch (window.location.hostname) {
        case "localhost":
            if (window.location.href.includes(LOCAL_ERROR_MODE_STRING)) {
                return LOCAL_ERROR;
            }
            return LOCAL;
        default:
            return PRODUCTION;
    }
}


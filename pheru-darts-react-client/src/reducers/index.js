import {combineReducers} from 'redux'
import game from "./game";
import user from "./user";
import playerPermission from "./playerPermission";
import games from "./games";
import stateMemory from "./stateMemory";
import statistics from "./statistics";
import modal from "./modal";
import serverInformation from "./serverInformation";
import notifications from "./notifications";
import speech from "./speech";
import app from "./app";

export default combineReducers({
    game, games, user, playerPermission, stateMemory, statistics, modal, serverInformation, notifications, speech, app
})
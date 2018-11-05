import {combineReducers} from 'redux'
import game from "./game";
import user from "./user";
import playerPermission from "./playerPermission";
import games from "./games";
import stateMemory from "./stateMemory";
import statistics from "./statistics";
import errors from "./errors";
import serverInformation from "./serverInformation";

export default combineReducers({
    game, games, user, playerPermission, stateMemory, statistics, errors, serverInformation
})
import {combineReducers} from 'redux'
import game from "./game";
import users from "./users";
import user from "./user";
import playerPermission from "./playerPermission";
import games from "./games";

export default combineReducers({
    game, games, user, users, playerPermission
})

import {combineReducers} from 'redux'
import game from "./game";
import users from "./users";
import user from "./user";
import playerPermission from "./playerPermission";

export default combineReducers({
    game, users, user, playerPermission
})

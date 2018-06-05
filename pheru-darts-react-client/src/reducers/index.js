import {combineReducers} from 'redux'
import game from "./game";
import users from "./users";

export default combineReducers({
    game, users
})

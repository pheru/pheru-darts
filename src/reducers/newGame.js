import {START_NEW_GAME} from "../actions/newGame";

const newGame = (state = [], action) => {
  switch (action.type) {
    case START_NEW_GAME:
      console.log(action.players);
      console.log(action.score);
      console.log(action.checkOutMode);
      return [
        ...state,
        {
          //TODO
        }
      ];
    default:
      return state
  }
};

export default newGame

import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/NewGameConfig";

const mapStateToProps = state => ({
    gameRunning: state.game !== null
});

const mapDispatchToProps = dispatch => ({
    startNewGame: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)

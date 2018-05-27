import {connect} from 'react-redux'
import {startNewGame} from "../actions/newGame";
import NewGameConfig from "../components/NewGameConfig";


const mapStateToProps = state => ({
    //TODO players
});

const mapDispatchToProps = dispatch => ({
    startNewGameButtonClicked: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)

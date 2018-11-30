import {connect} from 'react-redux'
import ScoreButtons from "../components/views/game/ScoreButtons";
import {addDart} from "../actions/game";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    addDart: (value, multiplier) => dispatch(addDart(value, multiplier))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScoreButtons)

import {connect} from 'react-redux'
import Game from "../components/Game";
import {undoDart} from "../actions/game";

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    undoDart: () => dispatch(undoDart())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)

import {connect} from 'react-redux'
import App from "../components/App";

const mapStateToProps = state => ({
    gameRunning: state.game !== null
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

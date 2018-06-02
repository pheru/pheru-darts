import {connect} from 'react-redux'
import App from "../components/App";
import {withRouter} from "react-router-dom";
import {fetchAllUsers} from "../actions/users";

const mapStateToProps = state => ({
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
    fetchAllUsers : () => dispatch(fetchAllUsers())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))
